#!/bin/bash
# Subdomain Setup Script for app.pennkraft.com
# Run this script on your cPanel server

echo "🚀 Setting up app.pennkraft.com subdomain..."

# Configuration
SUBDOMAIN_DIR="/home/inmoti87/app.pennkraft.com"
MAIN_SITE_DIR="/home/inmoti87/pennkraft.com/public_html"
REPO_DIR="/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal"
NODE_PATH="/opt/alt/alt-nodejs24/root/usr/bin"

# Step 1: Create subdomain directory structure
echo "📁 Creating subdomain directory..."
mkdir -p $SUBDOMAIN_DIR/public_html

# Step 2: Create .htaccess for subdomain
echo "📝 Creating .htaccess for subdomain..."
cat > $SUBDOMAIN_DIR/public_html/.htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy all requests to Node.js application on port 30000
# Update PORT if your Node.js app runs on a different port
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:30000/$1 [P,L]

# Headers for proxying
<IfModule mod_headers.c>
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Host "%{HTTP_HOST}e"
</IfModule>
EOF

# Step 3: Create symbolic link to static files
echo "🔗 Creating symbolic links to static files..."
ln -sf $REPO_DIR/.next $SUBDOMAIN_DIR/public_html/.next
ln -sf $REPO_DIR/public $SUBDOMAIN_DIR/public_html/public
ln -sf $REPO_DIR/node_modules $SUBDOMAIN_DIR/public_html/node_modules

# Step 4: Update main site .htaccess to exclude subdomain
echo "📝 Updating main site .htaccess..."
cat > $MAIN_SITE_DIR/.htaccess << 'EOF'
RewriteEngine On

# Exclude subdomain from main site rules
RewriteCond %{HTTP_HOST} ^app\.pennkraft\.com$ [NC]
RewriteRule ^ - [L]

# Force HTTPS for main site
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Main site rules here
# Add your WordPress or main site rules below
EOF

# Step 5: Create environment file for production
echo "🔧 Setting up production environment..."
cat > $REPO_DIR/.env.production << 'EOF'
# Production Environment Variables for app.pennkraft.com

# Database Configuration (PostgreSQL on InMotion Hosting)
DATABASE_URL="postgresql://inmoti87_pennkraft:Q6_Ou%5D9%23ZhiH@localhost:5432/inmoti87_portal?schema=public"

# Next.js Configuration
NEXT_PUBLIC_APP_URL="https://app.pennkraft.com"
NEXT_PUBLIC_MAIN_SITE_URL="https://www.pennkraft.com"
NODE_ENV="production"

# NextAuth.js Configuration
NEXTAUTH_URL="https://app.pennkraft.com"
NEXTAUTH_SECRET="0SIhqri5f5ac6tDP2Y5hzB63ph/LmQz63TeyH4W/9DY="

# Email Configuration
EMAIL_FROM="noreply@pennkraft.com"
EMAIL_SERVER_HOST="mail.pennkraft.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="noreply@pennkraft.com"
EMAIL_SERVER_PASSWORD=""

# Contact Email
CONTACT_EMAIL="ipenn@pennkraft.com"

# Security
RATE_LIMIT_PER_MINUTE="60"
SESSION_MAX_AGE="2592000"

# Feature Flags
ENABLE_SIGNUP="false"
ENABLE_SOCIAL_AUTH="false"
MAINTENANCE_MODE="false"
EOF

# Step 6: Copy production env to active env
cp $REPO_DIR/.env.production $REPO_DIR/.env

# Step 7: Build the application
echo "🏗️ Building the application..."
cd $REPO_DIR
export PATH=$NODE_PATH:$PATH
npm install --production
npm run build

# Step 8: Create PM2 ecosystem file for process management
echo "⚙️ Creating PM2 configuration..."
cat > $REPO_DIR/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'pennkraft-portal',
    script: 'npm',
    args: 'start',
    cwd: '/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal',
    env: {
      NODE_ENV: 'production',
      PORT: 30000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};
EOF

echo "✅ Subdomain setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. In cPanel, create subdomain 'app' for pennkraft.com"
echo "2. Point subdomain document root to: $SUBDOMAIN_DIR/public_html"
echo "3. Update Node.js app configuration in cPanel to use port 30000"
echo "4. Restart the Node.js application"
echo "5. Test at https://app.pennkraft.com"
echo ""
echo "🔍 To check Node.js app status:"
echo "   In cPanel → Node.js → View your app status"
echo ""
echo "📝 Note: Update the port number in .htaccess if different from 30000"