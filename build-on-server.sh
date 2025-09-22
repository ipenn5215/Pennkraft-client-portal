#!/bin/bash

# Build script for cPanel deployment
# Run this script on the server to build the Next.js application

echo "🚀 Starting Pennkraft Portal Build Process"
echo "========================================"

# Navigate to the application directory (Git repository location)
cd /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the right directory?"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: npm install failed"
    exit 1
fi

echo "🔨 Building Next.js application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "🗄️ Generating Prisma client..."
npx prisma generate --schema=./prisma/schema-postgres.prisma

if [ $? -ne 0 ]; then
    echo "⚠️ Warning: Prisma generate had issues (this might be okay)"
fi

echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Go to cPanel → Software → Node.js"
echo "2. Click RESTART to start the application"
echo "3. Visit https://pennkraft.com/portal to test"