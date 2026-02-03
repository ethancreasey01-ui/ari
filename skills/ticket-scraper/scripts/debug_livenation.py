#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup

url = "https://www.livenation.com.au/"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}
response = requests.get(url, headers=headers, timeout=30)
soup = BeautifulSoup(response.text, 'html.parser')

# Find all event cards
cards = soup.find_all(attrs={"data-testid": "module-content-list-item"})
print(f"Found {len(cards)} cards")

# Show cards with subtitle/caption (the ones with dates)
print("\n=== Cards with dates/venues ===")
count = 0
for i, card in enumerate(cards):
    title = card.find(attrs={"data-testid": "module-content-list-item-title"})
    subtitle = card.find(attrs={"data-testid": "module-content-list-item-subtitle"})
    caption = card.find(attrs={"data-testid": "module-content-list-item-caption"})
    
    if subtitle or caption:
        print(f"\n--- Card {i+1} ---")
        print(f"Title: {title.get_text(strip=True) if title else 'None'}")
        print(f"Subtitle: {subtitle.get_text(strip=True) if subtitle else 'None'}")
        print(f"Caption: {caption.get_text(strip=True) if caption else 'None'}")
        count += 1
        if count >= 10:
            break
