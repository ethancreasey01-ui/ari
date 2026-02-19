#!/bin/bash
# Package SocialSpark Extension for distribution

echo "📦 Packaging SocialSpark Extension..."

# Create distribution directory
mkdir -p dist

# Create ZIP file
zip -r dist/socialspark-extension.zip \
  manifest.json \
  js/ \
  icons/ \
  popup.html \
  README.md \
  INSTALL.md \
  -x "*.DS_Store"

echo "✅ Extension packaged!"
echo "📁 Location: dist/socialspark-extension.zip"
echo ""
echo "📋 Installation Instructions:"
echo "1. Unzip socialspark-extension.zip"
echo "2. Open Chrome → chrome://extensions/"
echo "3. Enable Developer mode"
echo "4. Click 'Load unpacked'"
echo "5. Select the unzipped folder"
