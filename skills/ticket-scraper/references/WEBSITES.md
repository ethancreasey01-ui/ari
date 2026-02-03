# Supported Ticket Websites

## LiveNation Australia

**URL**: https://www.livenation.com.au/

**What to Scrape**: Artist announcements, tour dates, venues

**Structure**:
- Main page shows featured/upcoming events
- Event cards typically contain:
  - Artist name (h2/h3 with class containing "title" or "artist")
  - Tour/event name (subtitle class)
  - Date (time element or date class)
  - Venue (venue class)
  - City (location class)
  - "Get Tickets" link (redirects to Ticketmaster)

**Notes**:
- LiveNation is primarily an **announcement platform**
- Actual ticket sales happen on Ticketmaster
- Good for knowing what's coming before it goes on sale
- Events may show "Announced" status for days/weeks before tickets available

**Rate Limits**:
- Be gentle: max 1 request per minute recommended
- Use sessions to maintain cookies

---

## Ticketmaster Australia

**URL**: https://www.ticketmaster.com.au/

**What to Scrape**: Active ticket sales, pricing, availability

**Structure**:
- Homepage shows trending events
- Search results show event listings
- Event cards contain:
  - Artist name (title class)
  - Date and time (datetime element)
  - Venue name (venue class)
  - Price range (price class)
  - "Buy Tickets" button (links to event page)

**Notes**:
- This is where **actual sales happen**
- Prices are dynamic (may change based on demand)
- Shows "On Sale" vs "Sold Out" vs "Limited" status
- Good for tracking competitor pricing strategies

**Rate Limits**:
- More strict than LiveNation
- Consider using Playwright for heavy scraping
- May require CAPTCHA solving for frequent requests

---

## Adding New Sites

To add a new ticket site:

1. **Analyze the site structure**:
   ```bash
   # Use Playwright CLI to inspect
   playwright-cli open https://www.newsite.com
   playwright-cli snapshot
   playwright-cli screenshot
   ```

2. **Identify event containers**:
   - Look for repeating patterns (cards, rows, items)
   - Note CSS classes or data attributes
   - Check if content loads dynamically (JavaScript)

3. **Add scraping method**:
   ```python
   def scrape_newsite(self):
       url = "https://www.newsite.com/events"
       events = []
       
       # Add scraping logic
       response = requests.get(url, headers=self.headers)
       soup = BeautifulSoup(response.text, 'html.parser')
       
       # Find event containers
       cards = soup.find_all('div', class_='event-card')
       
       for card in cards:
           event = self.parse_newsite_event(card)
           if event:
               events.append(event)
       
       return events
   ```

4. **Add parser method**:
   ```python
   def parse_newsite_event(self, card):
       event = {
           'source': 'newsite',
           'scrape_date': self.today,
           'artist': '',
           # ... other fields
       }
       
       # Extract data
       artist_elem = card.find('h2', class_='artist-name')
       if artist_elem:
           event['artist'] = artist_elem.get_text(strip=True)
       
       # ... extract other fields
       
       return event
   ```

5. **Update main run method**:
   ```python
   if source == 'newsite':
       events = self.scrape_newsite()
   ```

## Common Site Patterns

### Event Listing Pages
Most ticket sites use one of these patterns:

**Pattern A: Grid Layout**
```html
<div class="events-grid">
  <article class="event-card">...</article>
  <article class="event-card">...</article>
</div>
```

**Pattern B: List Layout**
```html
<ul class="events-list">
  <li class="event-item">...</li>
  <li class="event-item">...</li>
</ul>
```

**Pattern C: Table Layout** (older sites)
```html
<table class="events-table">
  <tr class="event-row">...</tr>
</table>
```

### JavaScript-Heavy Sites
If content loads via JavaScript:

1. **Check for JSON API** (Network tab in browser dev tools)
2. **Use Playwright** for browser automation
3. **Look for embedded JSON** in script tags:
   ```html
   <script>
   window.__INITIAL_STATE__ = {...events data...};
   </script>
   ```

## Site-Specific Tips

### Dynamic Content
If events load as you scroll:
- Check for pagination parameters in URL
- Look for API endpoints returning JSON
- Use Playwright to simulate scrolling

### Authentication
Some sites require login:
- Check if public data is available without login
- Use session cookies if needed
- Consider if login is allowed by Terms of Service

### Geo-Restrictions
Some sites block international IPs:
- Use Australian VPN/Proxy if scraping from overseas
- Some sites require AU-specific headers

## Legal Considerations

⚠️ **Important**: Always check a site's Terms of Service before scraping:

- Some sites explicitly prohibit scraping
- Commercial use may be restricted
- Consider contacting site for API access instead
- Respect robots.txt directives
- Don't overwhelm servers with requests

This tool is intended for competitive research and market intelligence, not for resale of data or automated purchasing.
