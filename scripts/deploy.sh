#!/bin/bash

# Automated Deployment Script for Pennkraft Portal
# This script runs on the InMotion server to deploy updates

echo "🚀 Starting Automated Deployment"
echo "================================"
date

# Configuration
APP_DIR="/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal"
NODE_PATH="/opt/alt/alt-nodejs24/root/usr/bin"
LOG_FILE="/home/inmoti87/logs/deployment.log"

# Ensure log directory exists
mkdir -p /home/inmoti87/logs

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Navigate to application directory
cd "$APP_DIR" || {
    log_message "❌ Error: Cannot access application directory"
    exit 1
}

# Set PATH to use Node.js 24
export PATH="$NODE_PATH:$PATH"

log_message "📥 Pulling latest changes from GitHub..."
git pull origin main 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_message "❌ Error: Git pull failed"
    exit 1
fi

log_message "📦 Installing dependencies..."
npm install --production 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_message "❌ Error: npm install failed"
    exit 1
fi

log_message "🗄️ Generating Prisma client..."
npx prisma generate --schema=./prisma/schema-postgres.prisma 2>&1 | tee -a "$LOG_FILE"

log_message "🔨 Building Next.js application..."
npm run build 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    log_message "❌ Error: Build failed"
    exit 1
fi

log_message "🔄 Restarting application..."
# Touch the app.js file to trigger cPanel restart
touch app.js

log_message "✅ Deployment completed successfully!"
echo ""
echo "Application URL: https://pennkraft.com/portal"
echo "Deployment log: $LOG_FILE"
echo "================================"