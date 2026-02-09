#!/usr/bin/env python3
"""
Download TikTok videos from URLs
Usage: python3 download_tiktok.py <tiktok_url> <output_dir>
"""

import sys
import os
import subprocess
import re

def download_tiktok(url, output_dir):
    """Download TikTok video using yt-dlp"""
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Try yt-dlp first (best for TikTok)
    try:
        result = subprocess.run([
            'yt-dlp',
            '--no-check-certificates',
            '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
            '-o', f'{output_dir}/%(title)s_%(id)s.%(ext)s',
            url
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Downloaded: {url}")
            return True
        else:
            print(f"⚠️  yt-dlp failed: {result.stderr}")
    except FileNotFoundError:
        print("⚠️  yt-dlp not found, trying alternative...")
    
    # Fallback to gallery-dl
    try:
        result = subprocess.run([
            'gallery-dl',
            '--destination', output_dir,
            url
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Downloaded: {url}")
            return True
    except FileNotFoundError:
        pass
    
    print("❌ Failed to download. Please install yt-dlp: pip install yt-dlp")
    return False

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python3 download_tiktok.py <tiktok_url> <output_dir>")
        sys.exit(1)
    
    url = sys.argv[1]
    output_dir = sys.argv[2]
    
    success = download_tiktok(url, output_dir)
    sys.exit(0 if success else 1)