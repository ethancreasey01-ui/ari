#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

# Test with a few events
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'}

test_urls = [
    "https://www.livenation.com.au/matt-rife-tickets-adp1302571",
    "https://www.livenation.com.au/onerepublic-tickets-adp1302067",
]

for url in test_urls:
    print(f"\n{'='*60}")
    print(f"Fetching: {url}")
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        text_content = soup.get_text()
        
        # Check status
        if 'sold out' in text_content.lower():
            print("Status: SOLD OUT")
        elif 'find tickets' in text_content.lower():
            print("Status: ON SALE")
        else:
            print("Status: UNKNOWN")
        
        # Check for VIP
        vip_pattern = re.compile(r'(VIP.*?TICKET|VIP.*?EXPERIENCE)', re.I)
        vip_matches = vip_pattern.findall(text_content)
        if vip_matches:
            print(f"VIP Packages: {list(set(vip_matches))[:2]}")
            
    except Exception as e:
        print(f"Error: {e}")
