#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup

url = "https://www.livenation.com.au/matt-rife-tickets-adp1302571"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

response = requests.get(url, headers=headers, timeout=15)
soup = BeautifulSoup(response.text, 'html.parser')

# Get all text and look for pricing keywords
text = soup.get_text()
lines = [l.strip() for l in text.split('\n') if l.strip()]

print("Looking for price-related text...")
for line in lines[:50]:
    if any(word in line.lower() for word in ['ticket', 'price', 'cost', '$', 'aud', 'from']):
        print(f"  {line}")
