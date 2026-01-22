#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🏗️  Building Module Federation Monorepo..."
echo "   Root: $ROOT_DIR"
echo ""

# Clean previous build
echo "🧹 Cleaning deploy directory..."
rm -rf "$ROOT_DIR/deploy"

# Build legacy first (remote must be built before host)
echo ""
echo "📦 Building Legacy App (Nuxt 2)..."
echo "   Directory: $ROOT_DIR/apps/legacy"
cd "$ROOT_DIR/apps/legacy"
rm -rf .nuxt dist
npm run build
npm run generate
cd "$ROOT_DIR"

# Build shell (host)
echo ""
echo "📦 Building Shell App (Nuxt 4)..."
echo "   Directory: $ROOT_DIR/apps/shell"
cd "$ROOT_DIR/apps/shell"
rm -rf .nuxt .output dist
npm run generate
cd "$ROOT_DIR"

# Assemble deploy directory
echo ""
echo "📁 Assembling deploy directory..."

# Create deploy directory
mkdir -p "$ROOT_DIR/deploy"

# Copy shell output to deploy root
if [ -d "$ROOT_DIR/apps/shell/.output/public" ]; then
  cp -r "$ROOT_DIR/apps/shell/.output/public"/* "$ROOT_DIR/deploy/"
  echo "   ✓ Shell assets copied from .output/public"
elif [ -d "$ROOT_DIR/apps/shell/dist" ]; then
  cp -r "$ROOT_DIR/apps/shell/dist"/* "$ROOT_DIR/deploy/"
  echo "   ✓ Shell assets copied from dist"
else
  echo "   ⚠️  Shell output not found!"
fi

# Copy legacy output to deploy/_legacy
# Note: router.base: '/_legacy/' causes Nuxt to output _nuxt inside a _legacy folder
# So dist/_legacy/_nuxt/* should go to deploy/_legacy/_nuxt/*
mkdir -p "$ROOT_DIR/deploy/_legacy"
if [ -d "$ROOT_DIR/apps/legacy/dist/_legacy/_nuxt" ]; then
  # Copy the _nuxt folder directly (avoiding double nesting)
  cp -r "$ROOT_DIR/apps/legacy/dist/_legacy/_nuxt" "$ROOT_DIR/deploy/_legacy/"
  echo "   ✓ Legacy _nuxt assets copied"
elif [ -d "$ROOT_DIR/apps/legacy/dist/_nuxt" ]; then
  # Fallback if structure is flat
  cp -r "$ROOT_DIR/apps/legacy/dist/_nuxt" "$ROOT_DIR/deploy/_legacy/"
  echo "   ✓ Legacy _nuxt assets copied (flat structure)"
else
  echo "   ⚠️  Legacy _nuxt output not found!"
fi

# Copy legacy HTML pages (for standalone access if needed)
if [ -d "$ROOT_DIR/apps/legacy/dist" ]; then
  find "$ROOT_DIR/apps/legacy/dist" -maxdepth 1 -name "*.html" -exec cp {} "$ROOT_DIR/deploy/_legacy/" \;
  # Copy page directories
  for dir in dashboard booking reports; do
    if [ -d "$ROOT_DIR/apps/legacy/dist/$dir" ]; then
      cp -r "$ROOT_DIR/apps/legacy/dist/$dir" "$ROOT_DIR/deploy/_legacy/"
    fi
  done
  echo "   ✓ Legacy HTML pages copied"
fi

# Verify remoteEntry.js exists
if [ -f "$ROOT_DIR/deploy/_legacy/_nuxt/remoteEntry.js" ]; then
  echo "   ✓ remoteEntry.js found at _legacy/_nuxt/remoteEntry.js"
else
  # Try to find it
  REMOTE_ENTRY=$(find "$ROOT_DIR/deploy/_legacy" -name "remoteEntry.js" 2>/dev/null | head -1)
  if [ -n "$REMOTE_ENTRY" ]; then
    echo "   ✓ remoteEntry.js found at: ${REMOTE_ENTRY#$ROOT_DIR/deploy/}"
  else
    echo "   ⚠️  remoteEntry.js not found - federation may not work"
  fi
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Deploy structure:"
echo "   deploy/"
if [ -d "$ROOT_DIR/deploy" ]; then
  find "$ROOT_DIR/deploy" -type f \( -name "*.html" -o -name "remoteEntry.js" \) | sed "s|$ROOT_DIR/deploy/|   ├── |g" | head -20
fi
echo ""
echo "📍 Output directory: $ROOT_DIR/deploy"
echo ""
echo "💡 To test locally:"
echo "   npx serve deploy"
