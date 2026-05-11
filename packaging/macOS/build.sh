#!/bin/bash
# ============================================================
# 情绪花园 — 数字沙盘  macOS .app Build Script
# ============================================================
# Usage: ./build.sh
# Requirements: Xcode Command Line Tools (xcode-select --install)
# ============================================================

set -e

PROJECT_NAME="情绪花园"
BUNDLE_ID="com.emotiongarden.sandplay"
DEPLOYMENT_TARGET="10.15"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/$PROJECT_NAME"
BUILD_DIR="$SCRIPT_DIR/build"
APP_BUNDLE="$BUILD_DIR/$PROJECT_NAME.app"
CONTENTS_DIR="$APP_BUNDLE/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

# Path to the HTML file (relative to project root)
HTML_SOURCE="/Users/pengzhan/Documents/hermes-docs/emotion-garden-sandplay/情绪花园_数字沙盘.html"

echo "=========================================="
echo " 情绪花园 — 数字沙盘 macOS Build Script"
echo "=========================================="

# Check for Swift compiler
if ! command -v swiftc &> /dev/null; then
    echo "ERROR: swiftc not found. Install Xcode Command Line Tools:"
    echo "  xcode-select --install"
    exit 1
fi

echo ""
echo "[1/4] Compiling Swift source..."
SWIFT_FILES=$(find "$PROJECT_DIR" -name "*.swift" -maxdepth 1)
if [ -z "$SWIFT_FILES" ]; then
    echo "ERROR: No Swift files found in $PROJECT_DIR"
    exit 1
fi

mkdir -p "$MACOS_DIR"
swiftc -o "$MACOS_DIR/$PROJECT_NAME" \
    $SWIFT_FILES \
    -framework Cocoa \
    -framework WebKit \
    -target "x86_64-apple-macosx$DEPLOYMENT_TARGET" \
    -O

echo "  ✓ Compiled: $MACOS_DIR/$PROJECT_NAME"

echo ""
echo "[2/4] Copying Info.plist..."
mkdir -p "$CONTENTS_DIR"
cp "$PROJECT_DIR/Info.plist" "$CONTENTS_DIR/Info.plist"
echo "  ✓ Info.plist copied"

echo ""
echo "[3/4] Copying HTML resources..."
mkdir -p "$RESOURCES_DIR"
cp "$HTML_SOURCE" "$RESOURCES_DIR/情绪花园_数字沙盘.html"
echo "  ✓ HTML file copied to Resources"

# Copy any additional assets (images, etc.) from the source directory
SOURCE_DIR="$(dirname "$HTML_SOURCE")"
for asset in "$SOURCE_DIR"/*; do
    basename=$(basename "$asset")
    if [ "$basename" != "情绪花园_数字沙盘.html" ] && [ -f "$asset" ]; then
        cp "$asset" "$RESOURCES_DIR/$basename" 2>/dev/null || true
    fi
done
echo "  ✓ Additional assets copied (if any)"

echo ""
echo "[4/4] Creating .app bundle structure..."
# Create PkgInfo file
echo -n "APPL????" > "$CONTENTS_DIR/PkgInfo"
echo "  ✓ .app bundle created at: $APP_BUNDLE"

echo ""
echo "=========================================="
echo " BUILD COMPLETE"
echo "=========================================="
echo ""
echo "  App Bundle: $APP_BUNDLE"
echo ""
echo "  To launch:"
echo "    open \"$APP_BUNDLE\""
echo ""
echo "  To package as DMG (optional):"
echo "    hdiutil create -volname \"情绪花园\" \\"
echo "      -srcfolder \"$APP_BUNDLE\" \\"
echo "      -ov -format UDZO \"$BUILD_DIR/情绪花园.dmg\""
echo "=========================================="
