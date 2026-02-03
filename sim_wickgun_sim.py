#!/usr/bin/env python3
"""
Lightweight Wick-Magic rotation + simple simulator (mode B) for Bybit spot 15m candles.
Outputs: trade_log.csv, summary.json
"""
import time
import json
import math
from datetime import datetime, timezone, timedelta
import ccxt
import pandas as pd
import numpy as np

# --- Config ---
# Reduced-size defaults to fit constrained executor environment.
START_USDT = 1000.0
PER_BUY = 50.0
MAX_PAIRS = 8
FEE_RATE = 0.001  # 0.1% taker
SLIPPAGE = 0.002  # 0.2%
GAIN_TARGET = 0.025
STOP_LOSS = -0.05
DAYS = 30
RESOLUTION = '15m'
TOP_N = 5

# Minimal scoring from your script (simplified)
def safe_float(x):
    try:
        return float(x)
    except:
        return np.nan

# reuse some functions from your script logic (simplified)

def fetch_ohlcv_df(exchange, symbol, timeframe, since, limit):
    data = exchange.fetch_ohlcv(symbol, timeframe=timeframe, since=since, limit=limit)
    df = pd.DataFrame(data, columns=["ts", "open", "high", "low", "close", "volume"]) 
    df['ts'] = pd.to_datetime(df['ts'], unit='ms', utc=True)
    return df

def jon_impulse_retrace_1d(exchange, symbol, window_days=35, now_ts=None):
    # fetch daily
    limit = window_days + 20
    if now_ts is None:
        now_ts = int(time.time()*1000)
    try:
        df = fetch_ohlcv_df(exchange, symbol, '1d', None, limit)
    except Exception:
        return np.nan, np.nan
    if df is None or len(df) < 10:
        return np.nan, np.nan
    df = df.tail(window_days)
    low = float(np.nanmin(df['low']))
    high = float(np.nanmax(df['high']))
    current = float(df['close'].iloc[-1])
    if low <= 0 or high <= low:
        return np.nan, np.nan
    pump = (high - low) / low
    retr = (high - current) / (high - low)
    return float(pump), float(retr)

# simplified score using retrace and volume spike

def score_row(retr, vol_spike, wick, rng24, spr, pump, corr):
    # normalize similar to your weights
    s_retr = 0.0 if np.isnan(retr) else 1.0 - min(1.0, abs(retr - 0.5) / 0.5)
    s_spike = 0.0 if np.isnan(vol_spike) else clamp((vol_spike - 1.0) / 4.0, 0.0, 1.0)
    s_wicks = 0.0 if np.isnan(wick) else clamp((wick - 0.20) / 0.50, 0.0, 1.0)
    s_rng = 0.0 if np.isnan(rng24) else clamp((rng24 - 0.03) / 0.30, 0.0, 1.0)
    score_0_1 = (0.35 * s_retr + 0.25 * clamp((pump - 0.05)/1.0,0,1) + 0.20 * s_spike + 0.15 * s_wicks)
    return float(15.0 * clamp(score_0_1, 0.0, 1.0))


def clamp(x, lo, hi):
    return max(lo, min(hi, x))

# Simulator engine (15m resolution)

def simulate():
    ex = ccxt.bybit({'enableRateLimit': True, 'options': {'defaultType': 'spot'}})
    # load markets
    markets = ex.load_markets()
    usdt_symbols = [s for s,m in markets.items() if isinstance(m, dict) and m.get('spot') and s.endswith('/USDT')]
    print('Total USDT symbols:', len(usdt_symbols))
    # fetch tickers to rank by quoteVolume
    tickers = ex.fetch_tickers(usdt_symbols)
    rows = []
    for sym in usdt_symbols:
        t = tickers.get(sym, {})
        qv = safe_float(t.get('quoteVolume'))
        rows.append((sym, qv))
    rows = sorted(rows, key=lambda x: (-(x[1] if not np.isnan(x[1]) else 0)))
    top = [r[0] for r in rows[:TOP_N]]
    print('Top symbols:', len(top))
    # time range
    end = int(time.time()*1000)
    start = end - DAYS*24*60*60*1000
    # fetch 15m ohlcv for each top symbol
    ohlcvs = {}
    for s in top:
        try:
            df = fetch_ohlcv_df(ex, s, RESOLUTION, since=start, limit=20000)
            ohlcvs[s] = df
            time.sleep(ex.rateLimit/1000)
        except Exception as e:
            print('fetch error', s, e)
    # Build per-symbol daily pump/retrace and simple vol spike from 1h
    candidates = []
    for s, df in ohlcvs.items():
        try:
            pump, retr = jon_impulse_retrace_1d(ex, s.replace('/',''), window_days=35)
        except:
            pump, retr = np.nan, np.nan
        # vol spike: compare last 24 x 1h to prev 7 days avg using 1h candles: approximate using 15m res
        try:
            vol = df['volume'].to_numpy(dtype=float)
            if len(vol) >= 24*4+7*24*4:
                last24 = vol[-24*4:].sum()
                prev = vol[-(24*4 + 7*24*4):-24*4]
                chunks = prev.reshape(7,24*4)
                avg24 = chunks.sum(axis=1).mean()
                vol_spike = last24/avg24 if avg24>0 else np.nan
            else:
                vol_spike = np.nan
        except:
            vol_spike = np.nan
        # wickiness: simple avg of (high-max(open,close)+min(open,close)-low)/range over last 96 15m
        try:
            o = df['open'].to_numpy(float); h=df['high'].to_numpy(float); l=df['low'].to_numpy(float); c=df['close'].to_numpy(float)
            upper = h - np.maximum(o,c); lower = np.minimum(o,c) - l; rng = np.maximum(h-l,1e-12); wick = np.nanmean((upper+lower)/rng)
        except:
            wick = np.nan
        # range24 from 15m
        try:
            hi = float(np.nanmax(df['high'][-96:])); lo=float(np.nanmin(df['low'][-96:])); rng24=(hi-lo)/lo if lo>0 else np.nan
        except:
            rng24=np.nan
        # spread naive
        try:
            t = tickers.get(s,{})
            bid = safe_float(t.get('bid')); ask=safe_float(t.get('ask'))
            if bid>0 and ask>0: spr = (ask-bid)/((ask+bid)/2)*10000
            else: spr=np.nan
        except:
            spr = np.nan
        score = score_row(retr, vol_spike, wick, rng24, spr, pump, np.nan)
        candidates.append({'symbol': s, 'score': score, 'retrace': retr})
    cand_df = pd.DataFrame(candidates).sort_values('score', ascending=False).reset_index(drop=True)
    # rotation per time step: iterate over time index (aligned to 15m) from start to end
    # build unified timeline from union of timestamps across symbols
    all_ts = set()
    for df in ohlcvs.values():
        all_ts.update(df['ts'].tolist())
    timeline = sorted(list(all_ts))
    # maintain portfolio
    cash = START_USDT
    positions = {}  # symbol -> {entry_ts, entry_price, size_usdt, qty}
    trades = []
    # simple rotation rule: every 4 hours recalc top candidates and enable BUY for top MAX_PAIRS
    step_seconds = 15*60
    recalc_interval = 4*60*60 # 4 hours
    last_recalc = None
    for t in timeline:
        ts = int(pd.Timestamp(t).timestamp()*1000)
        if last_recalc is None or (ts - last_recalc) >= recalc_interval*1000:
            # pick top MAX_PAIRS by precomputed score (static here)
            enabled = cand_df.head(MAX_PAIRS)['symbol'].tolist()
            last_recalc = ts
        # for each enabled symbol not already in positions, try to buy at next candle open (if available)
        for sym in enabled:
            if sym in positions: continue
            df = ohlcvs.get(sym)
            # find row with ts >= current
            row = df[df['ts'] >= pd.to_datetime(t)].head(1)
            if row.empty: continue
            openp = float(row['open'].iloc[0])
            # compute qty for PER_BUY after slippage and fee
            effective_price = openp*(1+SLIPPAGE)
            usdt_available = cash if cash>0 else 0
            if usdt_available < PER_BUY: continue
            qty = (PER_BUY*(1 - FEE_RATE)) / effective_price
            cash -= PER_BUY
            positions[sym] = {'entry_ts': int(row['ts'].iloc[0].timestamp()*1000), 'entry_price': effective_price, 'size_usdt': PER_BUY, 'qty': qty}
            trades.append({'symbol': sym, 'side':'BUY', 'ts': int(row['ts'].iloc[0].timestamp()*1000), 'price': effective_price, 'usdt': PER_BUY, 'qty': qty})
        # check exits for positions using current candle high/low
        to_remove = []
        for sym,p in positions.items():
            df = ohlcvs.get(sym)
            # find row at this timestamp
            row = df[df['ts'] >= pd.to_datetime(t)].head(1)
            if row.empty: continue
            high = float(row['high'].iloc[0]); low=float(row['low'].iloc[0]); openp=float(row['open'].iloc[0]); close=float(row['close'].iloc[0])
            entry = p['entry_price']
            target_price = entry*(1+GAIN_TARGET)
            stop_price = entry*(1+STOP_LOSS)
            exited = False
            exit_price = None
            exit_ts = int(row['ts'].iloc[0].timestamp()*1000)
            # assume if high >= target then exited at target (minus slippage/fee)
            if high >= target_price:
                exit_price = target_price*(1 - SLIPPAGE)*(1 - FEE_RATE)
                exited = True
                reason = 'GAIN'
            elif low <= stop_price:
                exit_price = stop_price*(1 - SLIPPAGE)*(1 - FEE_RATE)
                exited = True
                reason = 'STOP'
            if exited:
                usdt_in = p['size_usdt']
                usdt_out = p['qty'] * exit_price
                profit = usdt_out - usdt_in
                cash += usdt_out
                trades.append({'symbol': sym, 'side':'SELL', 'ts': exit_ts, 'price': exit_price, 'usdt': usdt_out, 'qty': p['qty'], 'pnl': profit, 'reason': reason})
                to_remove.append(sym)
        for r in to_remove:
            positions.pop(r, None)
    # at end, mark unrealized positions priced at last close
    unreal = 0.0
    for sym,p in positions.items():
        df = ohlcvs.get(sym)
        last_close = float(df['close'].iloc[-1])
        unreal += p['qty'] * last_close
    final_value = cash + unreal
    total_return = (final_value - START_USDT)/START_USDT
    # summarize
    trades_df = pd.DataFrame(trades)
    trades_df.to_csv('trade_log.csv', index=False)
    summary = {
        'start': START_USDT,
        'end': final_value,
        'return_pct': total_return*100,
        'trades': len(trades_df[trades_df['side']=='SELL']) if not trades_df.empty else 0,
    }
    with open('summary.json','w') as f:
        json.dump(summary, f, indent=2)
    print('Done. Summary:', summary)

if __name__ == '__main__':
    simulate()
