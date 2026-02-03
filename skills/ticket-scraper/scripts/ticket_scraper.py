#!/usr/bin/env python3
"""
Ticket Scraper for LiveNation AU and Ticketmaster AU
Tracks artist announcements, tour dates, venues, and ticket prices
Stores data in CSV format with daily snapshots and change detection
"""

import requests
import csv
import json
import os
import sys
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse
import hashlib

class TicketScraper:
    def __init__(self, data_dir="./ticket_data"):
        self.data_dir = data_dir
        self.today = datetime.now().strftime("%Y-%m-%d")
        self.ensure_dirs()
        
    def ensure_dirs(self):
        """Create data directory if it doesn't exist"""
        os.makedirs(self.data_dir, exist_ok=True)
        
    def get_csv_path(self, source):
        """Get CSV file path for a source"""
        return os.path.join(self.data_dir, f"{source}_{self.today}.csv")
        
    def get_master_csv_path(self, source):
        """Get master CSV file path for a source"""
        return os.path.join(self.data_dir, f"{source}_master.csv")
        
    def scrape_livenation(self):
        """Scrape LiveNation AU for artist announcements"""
        url = "https://www.livenation.com.au/"
        events = []
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for event cards using data-testid attribute
            event_cards = soup.find_all(attrs={"data-testid": "module-content-list-item"})
            
            print(f"Found {len(event_cards)} event cards on LiveNation")
            
            for card in event_cards:  # Process all events
                event = self.parse_livenation_event(card)
                if event and event.get('artist'):
                    events.append(event)
                    if len(events) >= 100:  # Limit to 100 events max
                        break
                    
        except Exception as e:
            print(f"Error scraping LiveNation: {e}")
            
        return events
        
    def fetch_event_details(self, event_url):
        """Fetch additional details from an event detail page"""
        if not event_url:
            return {'price': '', 'status': 'announced', 'vip_packages': []}
            
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            response = requests.get(event_url, headers=headers, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            text_content = soup.get_text()
            
            result = {
                'price': '',
                'status': 'announced',
                'vip_packages': []
            }
            
            # Check for sold out status
            if 'sold out' in text_content.lower():
                result['status'] = 'sold_out'
            elif 'find tickets' in text_content.lower() or 'buy tickets' in text_content.lower():
                result['status'] = 'on_sale'
            
            # Look for VIP packages
            vip_pattern = re.compile(r'VIP.*?(?:TICKET|EXPERIENCE|PACKAGE)', re.I)
            vip_matches = vip_pattern.findall(text_content)
            if vip_matches:
                # Get unique VIP package names (first 3)
                result['vip_packages'] = list(set(vip_matches))[:3]
            
            # Look for price ranges in text
            price_pattern = re.compile(r'\$[\d,]+(?:\.\d{2})?|\$[\d,]+\s*-\s*\$[\d,]+', re.I)
            price_matches = price_pattern.findall(text_content)
            if price_matches:
                result['price'] = ', '.join(list(set(price_matches))[:2])
            
            return result
            
        except Exception as e:
            print(f"Error fetching details from {event_url}: {e}")
            return {'price': '', 'status': 'announced', 'vip_packages': []}
        
    def parse_livenation_event(self, card):
        """Parse a LiveNation event card"""
        event = {
            'source': 'livenation',
            'scrape_date': self.today,
            'artist': '',
            'tour_name': '',
            'date': '',
            'venue': '',
            'city': '',
            'promoter': 'Live Nation',
            'ticket_price': '',
            'ticket_url': '',
            'status': 'announced'
        }
        
        try:
            # Artist name - in element with data-testid="module-content-list-item-title"
            artist_elem = card.find(attrs={"data-testid": "module-content-list-item-title"})
            if artist_elem:
                event['artist'] = artist_elem.get_text(strip=True)
            
            # Date and venue are in subtitle and caption (only for "Touring Now" section)
            subtitle_elem = card.find(attrs={"data-testid": "module-content-list-item-subtitle"})
            if subtitle_elem:
                date_text = subtitle_elem.get_text(strip=True)
                event['date'] = date_text
            
            caption_elem = card.find(attrs={"data-testid": "module-content-list-item-caption"})
            if caption_elem:
                venue_text = caption_elem.get_text(strip=True)
                # Usually format: "City, Venue Name"
                if ',' in venue_text:
                    parts = venue_text.split(',', 1)
                    event['city'] = parts[0].strip()
                    event['venue'] = parts[1].strip()
                else:
                    event['venue'] = venue_text
            
            # Ticket link - the card IS the anchor tag, or find child anchor
            href = card.get('href', '')
            if not href:
                link_elem = card.find('a', href=True)
                if link_elem:
                    href = link_elem.get('href', '')
            if href:
                if href.startswith('/'):
                    event['ticket_url'] = urljoin('https://www.livenation.com.au/', href)
                else:
                    event['ticket_url'] = href
                
        except Exception as e:
            print(f"Error parsing event: {e}")
            
        return event
        
    def scrape_ticketmaster(self):
        """Scrape Ticketmaster AU for ticket sales"""
        url = "https://www.ticketmaster.com.au/"
        events = []
        
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Look for event cards
            event_cards = soup.find_all(['div', 'article', 'li'], class_=re.compile(r'event|card|listing', re.I))
            
            for card in event_cards[:50]:
                event = self.parse_ticketmaster_event(card)
                if event and event.get('artist'):
                    events.append(event)
                    
        except Exception as e:
            print(f"Error scraping Ticketmaster: {e}")
            
        return events
        
    def parse_ticketmaster_event(self, card):
        """Parse a Ticketmaster event card"""
        event = {
            'source': 'ticketmaster',
            'scrape_date': self.today,
            'artist': '',
            'tour_name': '',
            'date': '',
            'venue': '',
            'city': '',
            'promoter': 'Ticketmaster',
            'ticket_price': '',
            'ticket_url': '',
            'status': 'on_sale'
        }
        
        try:
            # Artist name
            artist_elem = card.find(['h2', 'h3', 'h4', 'a'], class_=re.compile(r'title|name|artist', re.I))
            if artist_elem:
                event['artist'] = artist_elem.get_text(strip=True)
                
            # Date
            date_elem = card.find(['time', 'span'], class_=re.compile(r'date|time', re.I))
            if date_elem:
                event['date'] = date_elem.get_text(strip=True)
                
            # Venue
            venue_elem = card.find(class_=re.compile(r'venue|location', re.I))
            if venue_elem:
                event['venue'] = venue_elem.get_text(strip=True)
                
            # Price
            price_elem = card.find(class_=re.compile(r'price|cost|\$', re.I))
            if price_elem:
                event['ticket_price'] = price_elem.get_text(strip=True)
                
            # Ticket link
            link_elem = card.find('a', href=re.compile(r'/ticket/', re.I))
            if link_elem:
                event['ticket_url'] = urljoin('https://www.ticketmaster.com.au/', link_elem.get('href', ''))
                
        except Exception as e:
            print(f"Error parsing Ticketmaster event: {e}")
            
        return event
        
    def save_to_csv(self, events, source):
        """Save events to CSV file"""
        if not events:
            print(f"No events to save for {source}")
            return
            
        csv_path = self.get_csv_path(source)
        master_path = self.get_master_csv_path(source)
        
        # Fieldnames
        fieldnames = ['source', 'scrape_date', 'artist', 'tour_name', 'date', 
                     'venue', 'city', 'promoter', 'ticket_price', 'ticket_url', 'status']
        
        # Save daily snapshot
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(events)
            
        print(f"Saved {len(events)} events to {csv_path}")
        
        # Append to master CSV
        file_exists = os.path.exists(master_path)
        with open(master_path, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            if not file_exists:
                writer.writeheader()
            writer.writerows(events)
            
        return csv_path
        
    def compare_with_previous(self, source):
        """Compare today's data with yesterday's to find changes"""
        today_path = self.get_csv_path(source)
        yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
        yesterday_path = os.path.join(self.data_dir, f"{source}_{yesterday}.csv")
        
        changes = {
            'new_events': [],
            'price_changes': [],
            'sold_out': [],
            'on_sale': []
        }
        
        if not os.path.exists(yesterday_path) or not os.path.exists(today_path):
            print(f"Cannot compare: missing data for {yesterday} or {self.today}")
            return changes
            
        try:
            # Read yesterday's data
            yesterday_events = {}
            with open(yesterday_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    key = f"{row.get('artist', '')}-{row.get('date', '')}-{row.get('venue', '')}"
                    yesterday_events[key] = row
                    
            # Read today's data
            today_events = {}
            with open(today_path, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    key = f"{row.get('artist', '')}-{row.get('date', '')}-{row.get('venue', '')}"
                    today_events[key] = row
                    
            # Find new events
            for key, event in today_events.items():
                if key not in yesterday_events:
                    changes['new_events'].append(event)
                else:
                    # Check for price changes
                    old_price = yesterday_events[key].get('ticket_price', '')
                    new_price = event.get('ticket_price', '')
                    if old_price != new_price and new_price:
                        changes['price_changes'].append({
                            'artist': event['artist'],
                            'old_price': old_price,
                            'new_price': new_price,
                            'venue': event['venue'],
                            'date': event['date']
                        })
                        
                    # Check status changes
                    old_status = yesterday_events[key].get('status', '')
                    new_status = event.get('status', '')
                    if old_status != new_status:
                        if new_status == 'sold_out':
                            changes['sold_out'].append(event)
                        elif new_status == 'on_sale':
                            changes['on_sale'].append(event)
                            
        except Exception as e:
            print(f"Error comparing data: {e}")
            
        return changes
        
    def generate_report(self, changes):
        """Generate a human-readable report of changes"""
        report = []
        report.append(f"📊 Ticket Scraper Report - {self.today}")
        report.append("=" * 50)
        
        if changes['new_events']:
            report.append(f"\n🎵 {len(changes['new_events'])} New Events Announced:")
            for event in changes['new_events'][:10]:  # Show first 10
                report.append(f"  • {event['artist']} - {event['tour_name']} at {event['venue']} ({event['date']})")
                if event['ticket_url']:
                    report.append(f"    Tickets: {event['ticket_url']}")
                    
        if changes['price_changes']:
            report.append(f"\n💰 {len(changes['price_changes'])} Price Changes:")
            for change in changes['price_changes'][:10]:
                report.append(f"  • {change['artist']} at {change['venue']}: {change['old_price']} → {change['new_price']}")
                
        if changes['sold_out']:
            report.append(f"\n🚫 {len(changes['sold_out'])} Events Sold Out:")
            for event in changes['sold_out'][:10]:
                report.append(f"  • {event['artist']} at {event['venue']} ({event['date']})")
                
        if changes['on_sale']:
            report.append(f"\n✅ {len(changes['on_sale'])} Events Now On Sale:")
            for event in changes['on_sale'][:10]:
                report.append(f"  • {event['artist']} at {event['venue']} - {event['ticket_url']}")
                
        if not any(changes.values()):
            report.append("\n✨ No changes detected since yesterday.")
            
        return "\n".join(report)
        
    def enrich_with_details(self, events, max_events=20):
        """Fetch additional details (price, status, VIP) for events with URLs"""
        print(f"\n💰 Fetching event details for up to {max_events} events...")
        
        enriched = []
        count = 0
        
        for event in events:
            if event.get('ticket_url') and count < max_events:
                print(f"  Checking: {event['artist'][:40]}...", end=" ")
                details = self.fetch_event_details(event['ticket_url'])
                
                if details['price']:
                    event['ticket_price'] = details['price']
                if details['status']:
                    event['status'] = details['status']
                if details['vip_packages']:
                    event['tour_name'] = f"VIP: {', '.join(details['vip_packages'])}"
                    
                print(f"✓ {details['status']}")
                count += 1
            enriched.append(event)
            
        return enriched
        
    def run(self, sources=None, fetch_prices=False):
        """Run the scraper for specified sources"""
        if sources is None:
            sources = ['livenation', 'ticketmaster']
            
        all_changes = {}
        
        for source in sources:
            print(f"\n🔍 Scraping {source}...")
            
            if source == 'livenation':
                events = self.scrape_livenation()
            elif source == 'ticketmaster':
                events = self.scrape_ticketmaster()
            else:
                print(f"Unknown source: {source}")
                continue
                
            if events:
                # Optionally fetch additional details (limited to 10 for speed)
                if fetch_prices:
                    events = self.enrich_with_details(events, max_events=10)
                    
                self.save_to_csv(events, source)
                changes = self.compare_with_previous(source)
                all_changes[source] = changes
                
                # Print report
                report = self.generate_report(changes)
                print(report)
            else:
                print(f"No events found for {source}")
                
        return all_changes


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Scrape ticket sites for event data')
    parser.add_argument('--source', '-s', choices=['livenation', 'ticketmaster', 'all'], 
                       default='all', help='Which site to scrape')
    parser.add_argument('--data-dir', '-d', default='./ticket_data',
                       help='Directory to store CSV files')
    parser.add_argument('--compare', '-c', action='store_true',
                       help='Compare with yesterday and show changes')
    parser.add_argument('--prices', '-p', action='store_true',
                       help='Fetch ticket prices from event pages (slower)')
    
    args = parser.parse_args()
    
    # Determine sources
    if args.source == 'all':
        sources = ['livenation', 'ticketmaster']
    else:
        sources = [args.source]
    
    # Run scraper
    scraper = TicketScraper(data_dir=args.data_dir)
    changes = scraper.run(sources=sources, fetch_prices=args.prices)
    
    print(f"\n✅ Scraping complete! Data saved to {args.data_dir}/")
    print(f"📁 Master files: {args.data_dir}/*_master.csv")


if __name__ == '__main__':
    main()
