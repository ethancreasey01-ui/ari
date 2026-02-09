#!/usr/bin/env python3
"""
Create anime TikTok videos from scripts
Supports: ranking, vs_battle, explainer formats
Usage: python3 create_anime_video.py --script script.json --media ./images/ --output video.mp4
"""

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import tempfile

def get_media_files(media_dir, extensions=None):
    """Get all media files from directory"""
    if extensions is None:
        extensions = ['.png', '.jpg', '.jpeg', '.mp4', '.mov', '.webm']
    
    files = []
    for ext in extensions:
        files.extend(Path(media_dir).glob(f'*{ext}'))
        files.extend(Path(media_dir).glob(f'*{ext.upper()}'))
    
    return sorted(files)

def create_text_frame(text, size=(1080, 1920), font_size=80, text_color=(255,255,255), 
                     bg_color=(20,20,20), stroke_color=(0,0,0), stroke_width=4):
    """Create an image with text overlay"""
    img = Image.new('RGB', size, bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, fallback to default
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", font_size)
    except:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
    
    # Calculate text position (centered)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    # Draw stroke
    for dx in range(-stroke_width, stroke_width+1):
        for dy in range(-stroke_width, stroke_width+1):
            draw.text((x+dx, y+dy), text, font=font, fill=stroke_color)
    
    # Draw text
    draw.text((x, y), text, font=font, fill=text_color)
    
    return img

def create_ranking_video(script_data, media_files, output_path, temp_dir):
    """Create a ranking/countdown video"""
    items = script_data.get('items', [])
    timing = script_data.get('timing', {})
    time_per_item = timing.get('time_per_item', 1.5)
    
    print(f"🎬 Creating ranking video with {len(items)} items")
    
    # Create temporary directory for frames
    frames_dir = os.path.join(temp_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)
    
    frame_files = []
    frame_count = 0
    
    # Create hook frame (2 seconds)
    hook_text = script_data.get('hook', script_data.get('title', ''))
    hook_img = create_text_frame(hook_text, font_size=80, text_color=(255, 215, 0))  # Gold
    hook_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    hook_img.save(hook_path)
    # Duplicate for 2 seconds at 30fps
    for i in range(60):  # 2 seconds * 30 fps
        frame_files.append(hook_path)
    frame_count += 1
    
    # Create item frames
    for i, item in enumerate(items):
        rank = item.get('rank', len(items) - i)
        name = item.get('name', '[Character]')
        anime = item.get('anime', '')
        
        # Create frame with number and name
        img = Image.new('RGB', (1080, 1920), (15, 15, 25))  # Dark blue-gray
        draw = ImageDraw.Draw(img)
        
        # Try fonts
        try:
            number_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 200)
            name_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            number_font = ImageFont.load_default()
            name_font = ImageFont.load_default()
        
        # Draw large number
        number_text = str(rank)
        bbox = draw.textbbox((0, 0), number_text, font=number_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 600), number_text, font=number_font, fill=(255, 215, 0))  # Gold
        
        # Draw name
        bbox = draw.textbbox((0, 0), name, font=name_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 900), name, font=name_font, fill=(255, 255, 255))
        
        # Draw anime title smaller
        if anime:
            try:
                anime_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
            except:
                anime_font = ImageFont.load_default()
            bbox = draw.textbbox((0, 0), anime, font=anime_font)
            x = (1080 - (bbox[2] - bbox[0])) // 2
            draw.text((x, 1000), anime, font=anime_font, fill=(150, 150, 150))
        
        frame_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
        img.save(frame_path)
        
        # Add frames for duration
        frames_needed = int(time_per_item * 30)  # 30 fps
        for _ in range(frames_needed):
            frame_files.append(frame_path)
        
        frame_count += 1
    
    # Create outro frame
    outro_text = script_data.get('outro', 'Follow for more!')
    outro_img = create_text_frame(outro_text, font_size=60)
    outro_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    outro_img.save(outro_path)
    for i in range(90):  # 3 seconds
        frame_files.append(outro_path)
    
    # Actually duplicate frames (ffmpeg concat needs unique files)
    frames_dir_unique = os.path.join(temp_dir, 'frames_unique')
    os.makedirs(frames_dir_unique, exist_ok=True)
    
    for i, frame_path in enumerate(frame_files):
        ext = os.path.splitext(frame_path)[1]
        new_path = os.path.join(frames_dir_unique, f'frame_{i:05d}{ext}')
        # Copy the file
        import shutil
        shutil.copy(frame_path, new_path)
    
    # Build ffmpeg command using image2 demuxer
    cmd = [
        'ffmpeg',
        '-y',
        '-framerate', '30',
        '-i', os.path.join(frames_dir_unique, 'frame_%05d.png'),
        '-vf', 'format=yuv420p',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        output_path
    ]
    
    print(f"🚀 Rendering {len(frame_files)} frames...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Video created: {output_path}")
        return True
    else:
        print(f"❌ Error: {result.stderr}")
        return False

def create_vs_video(script_data, media_files, output_path, temp_dir):
    """Create a VS battle video"""
    char1 = script_data.get('characters', {}).get('char1', {}).get('name', 'Char1')
    char2 = script_data.get('characters', {}).get('char2', {}).get('name', 'Char2')
    sections = script_data.get('sections', [])
    
    print(f"🎬 Creating VS video: {char1} vs {char2}")
    
    frames_dir = os.path.join(temp_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)
    
    frame_files = []
    frame_count = 0
    
    # Hook frame (3 seconds)
    hook_text = script_data.get('hook', f'{char1} vs {char2}')
    hook_img = create_text_frame(hook_text, font_size=70, text_color=(255, 255, 255))
    hook_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    hook_img.save(hook_path)
    for _ in range(90):  # 3 seconds
        frame_files.append(hook_path)
    frame_count += 1
    
    # Section frames
    for section in sections:
        section_name = section.get('name', '')
        duration = section.get('duration', 8)
        
        img = Image.new('RGB', (1080, 1920), (25, 25, 35))
        draw = ImageDraw.Draw(img)
        
        try:
            header_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 70)
            body_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 50)
        except:
            header_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
        
        # Section header
        bbox = draw.textbbox((0, 0), section_name, font=header_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 400), section_name, font=header_font, fill=(255, 215, 0))
        
        # VS text
        vs_text = f"{char1} VS {char2}"
        bbox = draw.textbbox((0, 0), vs_text, font=body_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 700), vs_text, font=body_font, fill=(255, 255, 255))
        
        frame_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
        img.save(frame_path)
        
        frames_needed = int(duration * 30)
        for _ in range(frames_needed):
            frame_files.append(frame_path)
        
        frame_count += 1
    
    # Outro
    outro_text = script_data.get('outro', 'Comment who wins!')
    outro_img = create_text_frame(outro_text, font_size=60)
    outro_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    outro_img.save(outro_path)
    for _ in range(150):  # 5 seconds
        frame_files.append(outro_path)
    
    # Actually duplicate frames
    frames_dir_unique = os.path.join(temp_dir, 'frames_unique')
    os.makedirs(frames_dir_unique, exist_ok=True)
    
    for i, frame_path in enumerate(frame_files):
        ext = os.path.splitext(frame_path)[1]
        new_path = os.path.join(frames_dir_unique, f'frame_{i:05d}{ext}')
        import shutil
        shutil.copy(frame_path, new_path)
    
    cmd = [
        'ffmpeg',
        '-y',
        '-framerate', '30',
        '-i', os.path.join(frames_dir_unique, 'frame_%05d.png'),
        '-vf', 'format=yuv420p',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        output_path
    ]
    
    print(f"🚀 Rendering {len(frame_files)} frames...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Video created: {output_path}")
        return True
    else:
        print(f"❌ Error: {result.stderr}")
        return False

def create_explainer_video(script_data, media_files, output_path, temp_dir):
    """Create an explainer/educational video"""
    topic = script_data.get('topic', 'Topic')
    series = script_data.get('series', 'Anime')
    sections = script_data.get('sections', [])
    
    print(f"🎬 Creating explainer: {topic} in {series}")
    
    frames_dir = os.path.join(temp_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)
    
    frame_files = []
    frame_count = 0
    
    # Hook (3 seconds)
    hook_text = script_data.get('hook', f'{topic} explained...')
    hook_img = create_text_frame(hook_text, font_size=70, text_color=(168, 85, 247))  # Purple
    hook_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    hook_img.save(hook_path)
    for _ in range(90):
        frame_files.append(hook_path)
    frame_count += 1
    
    # Sections
    for section in sections:
        name = section.get('name', '')
        duration = section.get('duration', 7)
        
        img = Image.new('RGB', (1080, 1920), (20, 20, 30))
        draw = ImageDraw.Draw(img)
        
        try:
            header_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 60)
        except:
            header_font = ImageFont.load_default()
        
        # Section name with purple accent
        bbox = draw.textbbox((0, 0), name, font=header_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 500), name, font=header_font, fill=(168, 85, 247))
        
        # Topic reminder
        reminder = f"{topic} • {series}"
        try:
            small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
        except:
            small_font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), reminder, font=small_font)
        x = (1080 - (bbox[2] - bbox[0])) // 2
        draw.text((x, 800), reminder, font=small_font, fill=(200, 200, 200))
        
        frame_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
        img.save(frame_path)
        
        frames_needed = int(duration * 30)
        for _ in range(frames_needed):
            frame_files.append(frame_path)
        
        frame_count += 1
    
    # Outro
    outro_text = script_data.get('outro', 'Follow for more!')
    outro_img = create_text_frame(outro_text, font_size=60)
    outro_path = os.path.join(frames_dir, f'frame_{frame_count:04d}.png')
    outro_img.save(outro_path)
    for _ in range(150):
        frame_files.append(outro_path)
    
    # Create video
    frames_dir_unique = os.path.join(temp_dir, 'frames_unique')
    os.makedirs(frames_dir_unique, exist_ok=True)
    
    for i, frame_path in enumerate(frame_files):
        ext = os.path.splitext(frame_path)[1]
        new_path = os.path.join(frames_dir_unique, f'frame_{i:05d}{ext}')
        import shutil
        shutil.copy(frame_path, new_path)
    
    cmd = [
        'ffmpeg',
        '-y',
        '-framerate', '30',
        '-i', os.path.join(frames_dir_unique, 'frame_%05d.png'),
        '-vf', 'format=yuv420p',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        output_path
    ]
    
    print(f"🚀 Rendering {len(frame_files)} frames...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode == 0:
        print(f"✅ Video created: {output_path}")
        return True
    else:
        print(f"❌ Error: {result.stderr}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Create anime TikTok videos')
    parser.add_argument('--script', required=True, help='Path to script JSON')
    parser.add_argument('--media', help='Directory with images/clips (optional)')
    parser.add_argument('--output', default='output.mp4', help='Output video path')
    
    args = parser.parse_args()
    
    # Load script
    with open(args.script, 'r') as f:
        script_data = json.load(f)
    
    # Get media files if provided
    media_files = []
    if args.media:
        media_files = get_media_files(args.media)
        print(f"📁 Found {len(media_files)} media files")
    
    # Create temp directory
    with tempfile.TemporaryDirectory() as temp_dir:
        video_type = script_data.get('type', 'ranking')
        
        if video_type == 'ranking':
            success = create_ranking_video(script_data, media_files, args.output, temp_dir)
        elif video_type == 'vs_battle':
            success = create_vs_video(script_data, media_files, args.output, temp_dir)
        elif video_type == 'explainer':
            success = create_explainer_video(script_data, media_files, args.output, temp_dir)
        else:
            print(f"❌ Unknown video type: {video_type}")
            success = False
    
    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()