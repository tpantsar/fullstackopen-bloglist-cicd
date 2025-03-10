#!/bin/bash
echo "Build script for deployment"

# FRONTEND #
cd frontend
rm -rf dist/

echo "Installing frontend dependencies"
npm install

echo "Building frontend"
npm run build

# Copy the build directory to the backend root
rm -rf ../backend/dist/
cp -r dist/ ../backend/dist/

# BACKEND #
cd ../backend

echo "Installing backend dependencies"
npm install

# Go back to root directory
cd ..
