#!/bin/bash
echo "Build script for deployment"

cd backend

echo "Installing backend dependencies"
npm install

cd ../frontend

echo "Installing frontend dependencies"
npm install

echo "Building frontend"
npm run build