#!/bin/bash

# Build script for both main app and admin app
echo "Building main application..."
npm run build

echo "Building admin application..."
npm run admin:build

echo "Both builds completed successfully!"
echo "Main app: dist/"
echo "Admin app: dist-admin/"
