#!/bin/bash
# video_to_recipe.sh - Extract recipe from video and add to shopping list

VIDEO_URL="$1"

if [ -z "$VIDEO_URL" ]; then
    echo "Usage: video_to_recipe.sh <video_url>"
    echo "Supports: TikTok, Instagram, YouTube Shorts"
    exit 1
fi

echo "🎬 Downloading video from: $VIDEO_URL"

# Create temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

# Download video using yt-dlp
yt-dlp -o "video.%(ext)s" --no-playlist "$VIDEO_URL" 2>&1 | tail -5

# Find the downloaded video
VIDEO_FILE=$(ls video.* 2>/dev/null | head -1)

if [ -z "$VIDEO_FILE" ]; then
    echo "❌ Failed to download video"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "✓ Video downloaded: $VIDEO_FILE"

# Extract frames at 1 second intervals (where recipe text usually appears)
echo "📸 Extracting frames..."
ffmpeg -i "$VIDEO_FILE" -vf "fps=1/2,scale=1280:-1" -q:v 2 frame_%03d.jpg 2>&1 | tail -3

# Count frames
FRAME_COUNT=$(ls frame_*.jpg 2>/dev/null | wc -l)
echo "✓ Extracted $FRAME_COUNT frames"

# Show the frames for analysis
echo ""
echo "📝 Frames saved to: $TEMP_DIR"
echo "Next: Analyze frames to extract recipe text"

# Clean up video, keep frames
rm "$VIDEO_FILE"
echo ""
echo "To analyze a frame, use: image <frame_path>"
echo "Example frames:"
ls -la frame_*.jpg | head -5
