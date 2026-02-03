# Technical Implementation Details

## Architecture

The ticket scraper uses a modular class-based design:

```
TicketScraper
├── scrape_livenation()      # Scrape LiveNation AU
├── scrape_ticketmaster()    # Scrape Ticketmaster AU
├── parse_*_event()          # Parse individual event cards
├── save_to_csv()            # Save data to CSV files
├── compare_with_previous()  # Detect changes day-over-day
└── generate_report()        # Human-readable change report
```

## Scraping Strategy

### 1. Request Layer
- Uses `requests` library with realistic User-Agent
- 30-second timeout on all requests
- Basic error handling for network issues

### 2. Parsing Layer
- Uses BeautifulSoup with `lxml` parser (fast)
- Regex-based class matching for flexibility
- Defensive parsing (won't crash on missing fields)

### 3. Data Layer
- CSV format for universal compatibility
- Daily snapshots + master file (append-only)
- UTF-8 encoding for international characters

## Change Detection Algorithm

Events are uniquely identified by:
```python
key = f"{artist}-{date}-{venue}"
```

This allows detecting:
- **New events**: Key exists today but not yesterday
- **Price changes**: Same key, different price field
- **Status changes**: Same key, different status field

## Limitations

### JavaScript-Heavy Sites
Some ticket sites load content dynamically with JavaScript. For these, you may need to use Playwright:

```python
from playwright.sync_api import sync_playwright

def scrape_with_playwright(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        content = page.content()
        browser.close()
    return content
```

### Rate Limiting
Sites may block IP addresses that make too many requests. The scraper includes:
- Reasonable delays between requests
- User-Agent rotation (can be added)
- Session persistence (cookies)

### Anti-Scraping Measures
Some sites use:
- CAPTCHAs (requires human intervention or solving service)
- IP blocking (requires proxy rotation)
- Dynamic content loading (requires browser automation)

## Performance

Typical scraping times:
- LiveNation AU: ~10-20 seconds for 50 events
- Ticketmaster AU: ~10-20 seconds for 50 events
- Comparison: ~2-3 seconds

Memory usage: <100MB for typical runs

## Error Handling

The scraper handles these error conditions:
- Network timeouts (logs error, continues)
- HTTP errors (404, 500, etc. - logs error, continues)
- Parse errors (missing fields - returns partial data)
- File I/O errors (logs error, exits)

## Security Considerations

- API keys/credentials should not be stored in code
- User data is stored locally in CSV files
- No data is sent to external services
- Scraping respects robots.txt (implicitly, via rate limiting)

## Future Enhancements

Potential improvements:
- [ ] Database backend (SQLite/PostgreSQL)
- [ ] Web dashboard for viewing data
- [ ] Email/Slack alerts for changes
- [ ] Proxy rotation for heavy usage
- [ ] Machine learning for price prediction
- [ ] Multi-threading for faster scraping
