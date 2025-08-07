#!/bin/bash

# Clean deployment script for React 18 migration
echo "🧹 Cleaning all caches and artifacts..."

# Remove node_modules and lock files for complete clean install
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock

# Remove all build artifacts
rm -rf dist
rm -rf .vite
rm -rf .next

# Clear npm cache
npm cache clean --force

echo "📦 Installing React 18 dependencies..."
npm install

echo "🏗️ Building with React 18..."
npm run build

echo "✅ Build complete! Ready for deployment with React 18.3.1"
echo "📊 Bundle sizes:"
ls -la dist/assets/ | grep -E "\.(js|css)$" | awk '{print $9, $5}' | sort -k2 -n

echo ""
echo "🚀 To deploy:"
echo "1. Commit these changes to your repository"
echo "2. Trigger a new deployment on your hosting platform"
echo "3. Ensure deployment cache is cleared on your hosting platform"
