---
name: ticket-scraper
description: Scrape LiveNation AU and Ticketmaster AU for concert announcements, tour dates, venues, and ticket prices. Track competitor activity with daily CSV exports and change detection. Use when Kiara needs to monitor what events competitors are announcing, track ticket prices, or compare tour listings between LiveNation (announcements) and Ticketmaster (sales).
---

# Ticket Scraper 🎫

Scrape Australian ticket sites for event data and competitor intelligence.

## What It Does

- **LiveNation AU**: Scrape artist announcements, tour dates, venues
- **Ticketmaster AU**: Scrape actual ticket sales, pricing, availability
- **Change Detection**: Compare daily to find new events, price changes, sold out shows
- **CSV Export**: Simple data format for analysis and reporting

## Quick Start

```bash
# Install dependencies
pip3 install -r scripts/requirements.txt

# Scrape both sites
python3 scripts/ticket_scraper.py

# Scrape specific site
python3 scripts/ticket_scraper.py --source livenation
python3 scripts/ticket_scraper.py --source ticketmaster

# Show changes from yesterday
python3 scripts/ticket_scraper.py --compare
```

## Data Structure

Each event is saved with these fields:

| Field | Description | Example |
|-------|-------------|---------|
| `source` | Where data came from | livenation, ticketmaster |
| `scrape_date` | Date scraped | 2025-02-03 |
| `artist` | Artist/band name | "Taylor Swift" |
| `tour_name` | Tour name | "Eras Tour" |
| `date` | Event date | "March 15, 2025" |
| `venue` | Venue name | "MCG, Melbourne" |
| `city` | City | "Melbourne" |
| `promoter` | Promoter company | "Live Nation" |
| `ticket_price` | Price range | "$89.00 - $499.00" |
| `ticket_url` | Direct ticket link | https://ticketmaster.com.au/... |
| `status` | Sale status | announced, on_sale, sold_out |

## Output Files

Data is saved to `./ticket_data/`:

```
ticket_data/
├── livenation_2025-02-03.csv      # Today's LiveNation data
├── livenation_2025-02-02.csv      # Yesterday's data
├── livenation_master.csv          # All historical LiveNation data
├── ticketmaster_2025-02-03.csv    # Today's Ticketmaster data
├── ticketmaster_master.csv        # All historical Ticketmaster data
└── ...
```

## Change Detection

The scraper automatically compares today's data with yesterday's and reports:

- 🎵 **New events** just announced
- 💰 **Price changes** (increases/decreases)
- 🚫 **Sold out** shows
- ✅ **Now on sale** (went from announced to tickets available)

## Scheduling Daily Runs

### Option 1: Cron Job (Mac/Linux)

```bash
# Edit crontab
crontab -e

# Add daily run at 9 AM
0 9 * * * cd /Users/adbiptuy/clawd/skills/ticket-scraper && python3 scripts/ticket_scraper.py --compare >> scraper.log 2>&1
```

### Option 2: Clawdbot Cron

Use the Clawdbot cron tool to schedule daily scrapes and send reports to Telegram.

## Use Cases for Kiara

### 1. Track Competitor Announcements
```bash
python3 scripts/ticket_scraper.py --source livenation --compare
```
See what tours LiveNation just announced before they go on sale.

### 2. Monitor Ticket Pricing
```bash
python3 scripts/ticket_scraper.py --source ticketmaster --compare
```
Track how competitor prices change over time.

### 3. Find New Shows
```bash
# Run scraper
python3 scripts/ticket_scraper.py

# Check CSV for new events
cat ticket_data/livenation_master.csv | grep "2025-02-03"
```

### 4. Compare Announcements vs Sales
```bash
# Scrape both
python3 scripts/ticket_scraper.py

# See what's announced on LiveNation but not yet on Ticketmaster
diff ticket_data/livenation_2025-02-03.csv ticket_data/ticketmaster_2025-02-03.csv
```

## Extending the Scraper

### Add New Sites

Edit `scripts/ticket_scraper.py` and add a new method:

```python
def scrape_custom_site(self):
    """Scrape a custom ticket site"""
    url = "https://www.example.com"
    events = []
    # Add scraping logic
    return events
```

### Modify Data Fields

Edit the `fieldnames` in the `save_to_csv` method to track additional info.

### Change Frequency

Edit the cron schedule (daily = `0 9 * * *`, hourly = `0 * * * *`).

## Technical Notes

- Uses `requests` + `BeautifulSoup` for scraping
- Respects rate limits (built-in delays)
- Handles JavaScript-heavy sites via Playwright (optional)
- Data deduplication by artist+date+venue
- CSV format for easy Excel/Google Sheets import

## Troubleshooting

### No data returned
- Check if site structure changed (they may have updated their HTML)
- Try running with verbose output to see what's being parsed
- Some sites block scrapers - may need to add delays or use Playwright

### Comparison not working
- Make sure you have at least 2 days of data
- Check that CSV files exist in the data directory

### Dependencies missing
```bash
pip3 install beautifulsoup4 requests lxml
```

## References

- [TECHNICAL.md](references/TECHNICAL.md) - Implementation details
- [WEBSITES.md](references/WEBSITES.md) - Supported ticket sites and their structures
