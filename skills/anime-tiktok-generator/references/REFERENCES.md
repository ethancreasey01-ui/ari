# Anime TikTok Generator - References

## Installation Requirements

### Required Tools
```bash
# Install yt-dlp for TikTok downloads
pip install yt-dlp

# Install OpenCV for video analysis
pip install opencv-python numpy

# Optional: Install MoviePy for advanced editing
pip install moviepy

# Install ffmpeg (macOS)
brew install ffmpeg

# Install ffmpeg (Ubuntu/Debian)
sudo apt-get install ffmpeg
```

### API Keys (Optional)
- **OpenAI API Key**: For AI script generation (set as `OPENAI_API_KEY` env var)
- **ElevenLabs API Key**: For premium voiceover (set as `ELEVENLABS_API_KEY` env var)

## TikTok Video Specifications

### Format
- **Aspect Ratio**: 9:16 (vertical)
- **Resolution**: 1080 x 1920 pixels
- **Frame Rate**: 30 fps (minimum)
- **Duration**: 15-60 seconds optimal
- **File Format**: MP4

### Caption Best Practices
- **Font Size**: 60-80px for main text
- **Position**: Bottom third, centered
- **Colors**: High contrast (white text + black outline)
- **Duration**: Each caption visible for 2-3 seconds minimum
- **Animation**: Pop-in or slide-up preferred

### Content Structure
1. **Hook (0-3s)**: Stop the scroll
2. **Content (3-45s)**: Deliver value
3. **CTA (45-60s)**: Ask for engagement

## FFmpeg Commands Reference

### Resize to TikTok Format
```bash
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" output.mp4
```

### Add Captions
```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Hello':fontsize=60:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h-text_h-100" output.mp4
```

### Concatenate Multiple Clips
```bash
# Create file list
echo "file 'clip1.mp4'" > list.txt
echo "file 'clip2.mp4'" >> list.txt

# Concatenate
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

### Add Background Music
```bash
ffmpeg -i video.mp4 -i music.mp3 -shortest -c:v copy -c:a aac output.mp4
```

## Anime Content Ideas

### Trending Topics (Update Regularly)
- New season releases
- Character deaths/shocking moments
- Power scaling debates
- Manga vs anime comparisons
- Hidden details/easter eggs
- Theory videos
- "If you like X, watch Y" recommendations

### Evergreen Content
- Top 10 lists
- Best fights
- Saddest moments
- Plot twists
- Character rankings
- Underrated anime
- Beginner recommendations

## Voiceover Options

### System TTS (Free)
- macOS: `say` command
- Quality: Basic
- Speed: Fast

### OpenAI TTS
- Quality: Good
- Cost: $0.015 per 1K characters
- Speed: API call required

### ElevenLabs (Recommended)
- Quality: Excellent
- Cost: Free tier available
- Speed: API call required
- Best voices for anime content

## Caption Styles

### Style 1: Classic TikTok
- Font: Arial Bold / Helvetica Bold
- Size: 70px
- Color: White
- Stroke: 4px black
- Position: Center-bottom

### Style 2: Anime Aesthetic
- Font: Impact / Bebas Neue
- Size: 80px
- Color: Yellow (#FFD700)
- Stroke: 3px black
- Position: Center

### Style 3: Minimal
- Font: Montserrat Bold
- Size: 60px
- Color: White
- Stroke: 2px black
- Position: Bottom with padding

## Troubleshooting

### Issue: Download fails
**Solution**: Update yt-dlp: `pip install -U yt-dlp`

### Issue: Video has no audio
**Solution**: Check audio codec: `ffmpeg -i input.mp4 -c:v copy -c:a aac output.mp4`

### Issue: Captions not visible
**Solution**: Ensure font path is correct for your system

### Issue: Video quality poor
**Solution**: Add bitrate: `-b:v 5M` for 5Mbps

## Workflow Examples

### Complete Workflow
```bash
# 1. Download trending video
python3 scripts/download_tiktok.py "https://vt.tiktok.com/XXXXX" ./downloads/

# 2. Analyze it
python3 scripts/analyze_video.py ./downloads/video.mp4 --output ./analysis/

# 3. Generate script
python3 scripts/generate_script.py --topic "Top 5 betrayals" --style listicle --output ./script.json

# 4. Create video
python3 scripts/create_video.py --script ./script.json --clips ./my-clips/ --output ./final.mp4
```

### Quick Video Creation
```bash
# Generate and create in one go
python3 scripts/generate_script.py --topic "Underrated anime 2024" --output ./script.json
python3 scripts/create_video.py --script ./script.json --clips ./clips/ --output ./output.mp4
```