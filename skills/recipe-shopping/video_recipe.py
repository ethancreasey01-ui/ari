#!/usr/bin/env python3
"""
Video Recipe Extractor
Downloads TikTok/Instagram videos, extracts frames, reads recipe text with AI,
and adds ingredients to Apple Reminders shopping list.

Usage: python3 video_recipe.py <video_url>
"""

import subprocess
import sys
import os
import tempfile
import glob

def download_video(url, output_dir):
    """Download video using yt-dlp"""
    print(f"🎬 Downloading video from: {url}\n")
    
    try:
        result = subprocess.run(
            ['yt-dlp', '-o', 'video.%(ext)s', '--no-playlist', url],
            cwd=output_dir,
            capture_output=True,
            text=True,
            timeout=60
        )
        
        # Find the downloaded file
        video_files = glob.glob(os.path.join(output_dir, 'video.*'))
        if video_files:
            print(f"✓ Downloaded: {os.path.basename(video_files[0])}")
            return video_files[0]
        else:
            print("❌ Failed to download video")
            print(result.stderr)
            return None
            
    except Exception as e:
        print(f"❌ Error downloading: {e}")
        return None

def get_video_description(url):
    """Get video description/caption using yt-dlp"""
    print(f"📝 Fetching video description...\n")
    
    try:
        result = subprocess.run(
            ['yt-dlp', '--print', '%(title)s\n%(description)s', '--no-playlist', url],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            lines = result.stdout.strip().split('\n')
            title = lines[0] if len(lines) > 0 else "Unknown"
            description = '\n'.join(lines[1:]) if len(lines) > 1 else ""
            
            print(f"✓ Title: {title[:80]}...")
            if description:
                print(f"✓ Description: {description[:200]}...")
            
            return title, description
        else:
            print(f"⚠️  Could not fetch description")
            return None, None
            
    except Exception as e:
        print(f"⚠️  Error fetching description: {e}")
        return None, None

def extract_frames(video_path, output_dir):
    """Extract frames from video using ffmpeg"""
    print(f"\n📸 Extracting frames...")
    
    try:
        # Extract 1 frame every 2 seconds, scaled to 1280px width
        result = subprocess.run(
            ['ffmpeg', '-i', video_path, '-vf', 'fps=1/2,scale=1280:-1', 
             '-q:v', '2', 'frame_%03d.jpg'],
            cwd=output_dir,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        frames = glob.glob(os.path.join(output_dir, 'frame_*.jpg'))
        print(f"✓ Extracted {len(frames)} frames")
        return sorted(frames)
        
    except Exception as e:
        print(f"❌ Error extracting frames: {e}")
        return []

def analyze_frame_with_vision(frame_path):
    """Use image analysis to read text from frame"""
    # This would call the image tool - placeholder for now
    print(f"  Analyzing: {os.path.basename(frame_path)}")
    # In real implementation, we'd use the image() tool here
    return ""

def process_video(url):
    """Main pipeline: video → frames + description → recipe → shopping list"""
    
    # Create temp directory
    temp_dir = tempfile.mkdtemp(prefix='recipe_video_')
    print(f"📁 Working in: {temp_dir}\n")
    
    try:
        # Step 1: Get video description (often contains full recipe with QTY)
        title, description = get_video_description(url)
        
        # Step 2: Download video
        video_path = download_video(url, temp_dir)
        if not video_path:
            return
        
        # Step 3: Extract frames
        frames = extract_frames(video_path, temp_dir)
        if not frames:
            print("❌ No frames extracted")
            return
        
        # Step 4: Show what we captured
        print(f"\n🖼️  Frames extracted: {len(frames)}")
        print(f"   Sample frames: {', '.join([os.path.basename(f) for f in frames[:3]])}")
        
        if description:
            print(f"\n📝 Description captured: {len(description)} chars")
            print(f"   (This often has the full recipe with quantities!)")
        
        print(f"\n🎯 Next steps:")
        print(f"   1. Analyze frames for visual ingredients")
        print(f"   2. Parse description for quantities & full recipe")
        print(f"   3. Add to your shopping list!")
        
        print(f"\n💡 Tip: All files saved in {temp_dir}")
        
        return temp_dir, frames, title, description
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
        return None, None, None, None

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 video_recipe.py <video_url>")
        print("Supports: TikTok, Instagram, YouTube Shorts")
        sys.exit(1)
    
    video_url = sys.argv[1]
    temp_dir, frames, title, description = process_video(video_url)
    
    if temp_dir:
        print(f"\n✅ Video processed successfully!")
        print(f"📂 Frames location: {temp_dir}")
        if description:
            print(f"\n📝 Full Description:\n{description[:500]}...")
