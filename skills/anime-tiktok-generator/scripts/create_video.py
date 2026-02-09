#!/usr/bin/env python3
"""
Create complete TikTok video from script and clips
Usage: python3 create_video.py --script script.json --clips ./clips/ --output final.mp4
"""

import argparse
import json
import os
import subprocess
import random
import sys
from pathlib import Path

def get_clip_files(clips_dir):
    """Get all video clips from directory"""
    extensions = ['.mp4', '.mov', '.avi', '.mkv']
    clips = []
    for ext in extensions:
        clips.extend(Path(clips_dir).glob(f'*{ext}'))
    return sorted(clips)

def create_caption_filters(script_data, width=1080, height=1920):
    """Generate FFmpeg caption filters"""
    captions = []
    
    style = script_data.get('captions_style', {})
    font_color = style.get('color', 'white')
    stroke_color = style.get('stroke', 'black')
    
    # Hook caption (first 3 seconds)
    hook_text = script_data.get('hook', '').replace("'", "'")
    hook_filter = (
        f"drawtext=text='{hook_text}':"
        f"fontfile=/System/Library/Fonts/Helvetica.ttc:"
        f"fontsize=72:fontcolor={font_color}:"
        f"borderw=4:bordercolor={stroke_color}:"
        f"x=(w-text_w)/2:y=(h-text_h)/2:"
        f"enable='between(t,0,3)'"
    )
    captions.append(hook_filter)
    
    return ','.join(captions) if captions else None

def create_video_ffmpeg(script_file, clips_dir, output_file, add_captions=True, add_music=True):
    """Create video using FFmpeg"""
    
    # Load script
    with open(script_file, 'r') as f:
        script = json.load(f)
    
    print(f"🎬 Creating video: {script.get('title', 'Untitled')}")
    print(f"⏱️  Target duration: {script.get('total_duration', 45)}s")
    
    # Get clips
    clips = get_clip_files(clips_dir)
    if not clips:
        print(f"❌ No video clips found in {clips_dir}")
        return False
    
    print(f"📹 Found {len(clips)} clips")
    
    # Create temporary file list for concatenation
    temp_dir = os.path.dirname(output_file) or '.'
    concat_file = os.path.join(temp_dir, 'concat_list.txt')
    
    with open(concat_file, 'w') as f:
        for clip in clips:
            f.write(f"file '{clip.absolute()}'\n")
    
    # Build FFmpeg command
    cmd = [
        'ffmpeg',
        '-y',
        '-f', 'concat',
        '-safe', '0',
        '-i', concat_file,
        '-vf', f'scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,setsar=1',
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', str(script.get('total_duration', 45)),
    ]
    
    # Add captions
    if add_captions:
        caption_filter = create_caption_filters(script)
        if caption_filter:
            cmd[6] = cmd[6] + ',' + caption_filter
    
    # Add music
    if add_music:
        # Look for music files
        music_files = list(Path(clips_dir).parent.glob('assets/music/*'))
        if music_files:
            music_file = random.choice(music_files)
            cmd.extend(['-i', str(music_file), '-shortest', '-c:a', 'aac', '-b:a', '192k'])
    
    cmd.append(output_file)
    
    print(f"🚀 Rendering video...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    # Cleanup
    os.remove(concat_file)
    
    if result.returncode == 0:
        print(f"✅ Video created: {output_file}")
        return True
    else:
        print(f"❌ FFmpeg error: {result.stderr}")
        return False

def create_video_moviepy(script_file, clips_dir, output_file):
    """Alternative: Create video using MoviePy (more flexible)"""
    try:
        from moviepy.editor import VideoFileClip, concatenate_videoclips, CompositeVideoClip, TextClip
        
        # Load script
        with open(script_file, 'r') as f:
            script = json.load(f)
        
        # Load clips
        clips = get_clip_files(clips_dir)
        video_clips = [VideoFileClip(str(c)) for c in clips]
        
        # Resize to TikTok format (9:16)
        resized_clips = []
        for clip in video_clips:
            # Resize maintaining aspect ratio, then pad to 9:16
            w, h = clip.size
            target_h = 1920
            target_w = 1080
            
            # Resize based on height
            new_w = int(w * (target_h / h))
            resized = clip.resize(height=target_h)
            
            # Crop or pad to target width
            if new_w > target_w:
                # Crop center
                x_center = new_w // 2
                resized = resized.crop(x1=x_center - target_w//2, x2=x_center + target_w//2)
            elif new_w < target_w:
                # Pad with black
                from moviepy.editor import ColorClip
                pad = ColorClip(size=(target_w, target_h), color=(0,0,0)).set_duration(resized.duration)
                x_offset = (target_w - new_w) // 2
                resized = CompositeVideoClip([pad, resized.set_position((x_offset, 0))])
            
            resized_clips.append(resized)
        
        # Concatenate
        final = concatenate_videoclips(resized_clips, method='compose')
        
        # Trim to target duration
        target_duration = script.get('total_duration', 45)
        if final.duration > target_duration:
            final = final.subclip(0, target_duration)
        
        # Add captions
        hook_text = script.get('hook', '')
        if hook_text:
            hook_caption = TextClip(
                hook_text,
                fontsize=70,
                color='white',
                stroke_color='black',
                stroke_width=3,
                font='Helvetica-Bold',
                size=(1000, None),
                method='caption'
            ).set_duration(3).set_position('center')
            
            final = CompositeVideoClip([final, hook_caption])
        
        # Write output
        final.write_videofile(
            output_file,
            fps=30,
            codec='libx264',
            audio_codec='aac',
            threads=4
        )
        
        # Cleanup
        for clip in video_clips:
            clip.close()
        final.close()
        
        print(f"✅ Video created: {output_file}")
        return True
        
    except ImportError:
        print("⚠️  MoviePy not installed, falling back to FFmpeg")
        return create_video_ffmpeg(script_file, clips_dir, output_file)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Create TikTok videos from scripts')
    parser.add_argument('--script', required=True, help='Path to script JSON file')
    parser.add_argument('--clips', required=True, help='Directory containing video clips')
    parser.add_argument('--output', default='output.mp4', help='Output video path')
    parser.add_argument('--no-captions', action='store_true', help='Skip captions')
    parser.add_argument('--no-music', action='store_true', help='Skip background music')
    parser.add_argument('--use-moviepy', action='store_true', help='Use MoviePy instead of FFmpeg')
    
    args = parser.parse_args()
    
    if args.use_moviepy:
        success = create_video_moviepy(args.script, args.clips, args.output)
    else:
        success = create_video_ffmpeg(
            args.script, 
            args.clips, 
            args.output,
            add_captions=not args.no_captions,
            add_music=not args.no_music
        )
    
    sys.exit(0 if success else 1)