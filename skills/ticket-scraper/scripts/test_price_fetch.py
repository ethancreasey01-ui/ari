#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# Test fetching Matt Rife event page
url = "https://www.livenation.com.au/matt-rife-tickets-adp1302571"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

print(f"Fetching: {url}")
response = requests.get(url, headers=headers, timeout=15)
print(f"Status: {response.status_code}")

soup = BeautifulSoup(response.text, 'html.parser')

# Look for price information
prices = []

# Common price selectors
price_selectors = [
    '[data-testid="ticket-price"]',
    '.ticket-price',
    '.price',
    '[class*="price"]',
    '.ticket-range',
    '.from-price'
]

print("\nChecking selectors...")
for selector in price_selectors:
    elems = soup.select(selector)
    if elems:
        print(f"  {selector}: found {len(elems)} elements")
        for elem in elems[:2]:
            print(f"    Text: {elem.get_text(strip=True)[:100]}")
    else:
        print(f"  {selector}: not found")

# Search for text containing dollar amounts
print("\nSearching for dollar amounts in text...")
import re
price_pattern = re.compile(r'\$[\d,]+(?:\.\d{2})?|\$[\d,]+\s*-\s*\$[\d,]+', re.I)
text_content = soup.get_text()
matches = price_pattern.findall(text_content)
if matches:
    unique_prices = list(set(matches))[:5]
    print(f"Found prices: {unique_prices}")
else:
    print("No dollar amounts found")
