#!/bin/bash

# Vercel Deployment Script for Serles Bake
# This script prepares the project for Vercel deployment

echo "🚀 Preparing Serles Bake for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the app directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate sitemap
echo "🗺️ Generating sitemap..."
npm run generate-sitemap

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🎉 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Vercel"
    echo "3. Set environment variables in Vercel dashboard"
    echo "4. Deploy!"
    echo ""
    echo "📋 Environment variables to set in Vercel:"
    echo "NEXT_PUBLIC_API_BASE_URL=https://serlesbackend.vercel.app"
    echo "NEXT_PUBLIC_SITE_URL=https://www.serlesbake.in"
    echo "NEXT_PUBLIC_PHONE=+916383070725"
    echo "NEXT_PUBLIC_EMAIL=serlesbake@gmail.com"
    echo ""
    echo "📖 See VERCEL_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi 