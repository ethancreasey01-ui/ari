#!/usr/bin/env python3
"""
Analyze TikTok video: extract frames, transcribe audio, detect editing style
Usage: python3 analyze_video.py <video_file> --output <analysis_dir>
"""

import sys
import os
import subprocess
import json
import cv2
import numpy as np
from pathlib import Path

def extract_frames(video_path, output_dir, num_frames=10):
    """Extract key frames from video"""
    frames_dir = os.path.join(output_dir, 'frames')
    os.makedirs(frames_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    frame_indices = np.linspace(0, total_frames-1, num_frames, dtype=int)
    
    extracted = []
    for idx in frame_indices:
        cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
        ret, frame = cap.read()
        if ret:
            frame_path = os.path.join(frames_dir, f'frame_{idx:04d}.jpg')
            cv2.imwrite(frame_path, frame)
            extracted.append(frame_path)
    
    cap.release()
    print(f"✅ Extracted {len(extracted)} frames to {frames_dir}")
    return extracted

def get_video_info(video_path):
    """Get video metadata"""
    cap = cv2.VideoCapture(video_path)
    
    info = {
        'duration': cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS),
        'fps': cap.get(cv2.CAP_PROP_FPS),
        'width': int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
        'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
        'total_frames': int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    }
    
    cap.release()
    return info

def detect_cuts(video_path, threshold=30):
    """Detect scene cuts/transition points"""
    cap = cv2.VideoCapture(video_path)
    
    cuts = []
    prev_frame = None
    frame_num = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        if prev_frame is not None:
            # Calculate frame difference
            diff = cv2.absdiff(frame, prev_frame)
            diff_score = np.mean(diff)
            
            if diff_score > threshold:
                cuts.append({
                    'frame': frame_num,
                    'time': frame_num / cap.get(cv2.CAP_PROP_FPS),
                    'intensity': float(diff_score)
                })
        
        prev_frame = frame
        frame_num += 1
    
    cap.release()
    return cuts

def analyze_video(video_path, output_dir):
    """Full video analysis"""
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"🎬 Analyzing: {video_path}")
    
    # Get basic info
    info = get_video_info(video_path)
    print(f"📊 Duration: {info['duration']:.1f}s, {info['width']}x{info['height']}")
    
    # Extract frames
    frames = extract_frames(video_path, output_dir)
    
    # Detect cuts
    cuts = detect_cuts(video_path)
    print(f"✂️  Detected {len(cuts)} scene cuts")
    
    # Analyze editing style
    avg_cut_interval = info['duration'] / (len(cuts) + 1) if cuts else info['duration']
    
    style = {
        'format': '9:16 (TikTok)' if info['height'] > info['width'] else '16:9',
        'duration': info['duration'],
        'editing_pace': 'fast' if avg_cut_interval < 2 else 'medium' if avg_cut_interval < 4 else 'slow',
        'avg_cut_interval': avg_cut_interval,
        'num_cuts': len(cuts),
        'cuts': cuts[:20]  # First 20 cuts
    }
    
    # Save analysis
    analysis_path = os.path.join(output_dir, 'analysis.json')
    with open(analysis_path, 'w') as f:
        json.dump({
            'video_info': info,
            'style': style,
            'frames': frames
        }, f, indent=2)
    
    print(f"✅ Analysis saved to {analysis_path}")
    return style

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_video.py <video_file> --output <analysis_dir>")
        sys.exit(1)
    
    video_path = sys.argv[1]
    output_dir = './analysis'
    
    if '--output' in sys.argv:
        idx = sys.argv.index('--output')
        output_dir = sys.argv[idx + 1]
    
    analyze_video(video_path, output_dir)