#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

url = "https://www.livenation.com.au/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
response = requests.get(url, headers=headers, timeout=30)
soup = BeautifulSoup(response.text, 'html.parser')

cards = soup.find_all(attrs={"data-testid": "module-content-list-item"})

# Find Matt Rife card
for i, card in enumerate(cards):
    title = card.find(attrs={"data-testid": "module-content-list-item-title"})
    if title and "Matt Rife" in title.get_text():
        print(f"Card {i}: {title.get_text(strip=True)}")
        
        # Check for link
        link = card.find('a', href=True)
        if link:
            href = link.get('href', '')
            print(f"  Link found: {href[:100]}")
            full_url = urljoin('https://www.livenation.com.au/', href)
            print(f"  Full URL: {full_url}")
        else:
            print("  No link found!")
            print(f"  Card HTML: {card}")
        break
