#!/bin/bash

echo "🍎 Markdown Editor Pro - macOS Installer"
echo "========================================"
echo

# Check if we're on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ This script is only for macOS"
    exit 1
fi

# Find the downloaded DMG file
DMG_FILES=(~/Downloads/Markdown*Editor*Pro*.dmg)
if [ ${#DMG_FILES[@]} -eq 0 ] || [ ! -f "${DMG_FILES[0]}" ]; then
    echo "❌ No Markdown Editor Pro DMG file found in Downloads folder"
    echo "Please download the DMG file first from:"
    echo "https://github.com/singaxdev/markdown-editor-pro/releases/latest"
    exit 1
fi

DMG_FILE="${DMG_FILES[0]}"
echo "📦 Found DMG file: $(basename "$DMG_FILE")"

# Remove quarantine attribute
echo "🔓 Removing macOS security quarantine..."
if xattr -d com.apple.quarantine "$DMG_FILE" 2>/dev/null; then
    echo "✅ Security quarantine removed successfully"
else
    echo "⚠️  Quarantine removal failed or not needed"
fi

# Try to open the DMG
echo "📂 Opening DMG file..."
if open "$DMG_FILE"; then
    echo "✅ DMG opened successfully!"
    echo
    echo "📋 Next steps:"
    echo "1. Drag 'Markdown Editor Pro' to the Applications folder"
    echo "2. Launch the app from Applications or Launchpad"
    echo "3. Enjoy writing! 🚀"
else
    echo "❌ Failed to open DMG file"
    echo "You can try opening it manually from Downloads folder"
fi

echo
echo "🎯 If you still have issues, try:"
echo "   Right-click the DMG → Open → Open (to bypass Gatekeeper)" 