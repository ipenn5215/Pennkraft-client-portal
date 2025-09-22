#!/bin/bash
# Remote Setup Script for app.pennkraft.com
# Run this script in cPanel Terminal

echo "🚀 Setting up app.pennkraft.com subdomain on server..."
echo "Current directory: $(pwd)"

# Configuration
export SUBDOMAIN_DIR="/home/inmoti87/app.pennkraft.com"
export MAIN_SITE_DIR="/home/inmoti87/pennkraft.com/public_html"
export REPO_DIR="/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal"
export NODE_PATH="/opt/alt/alt-nodejs24/root/usr/bin"
export PATH=$NODE_PATH:$PATH

# Step 1: Check if subdomain directory exists, create if not
echo ""
echo "📁 Step 1: Creating subdomain directory structure..."
if [ ! -d "$SUBDOMAIN_DIR/public_html" ]; then
    mkdir -p $SUBDOMAIN_DIR/public_html
    echo "✓ Created subdomain directory"
else
    echo "✓ Subdomain directory already exists"
fi

# Step 2: Create .htaccess for subdomain
echo ""
echo "📝 Step 2: Creating .htaccess for subdomain..."
cat > $SUBDOMAIN_DIR/public_html/.htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Proxy all requests to Node.js application
# IMPORTANT: Update PORT_NUMBER with actual port from cPanel
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:30000/$1 [P,L]

# Headers for proxying
<IfModule mod_headers.c>
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Host "%{HTTP_HOST}e"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
EOF

echo "✓ Created .htaccess file"

# Step 3: Update repository
echo ""
echo "📥 Step 3: Updating repository..."
cd $REPO_DIR
git pull origin main
echo "✓ Repository updated"

# Step 4: Create/Update production environment file
echo ""
echo "🔧 Step 4: Setting up production environment..."
cat > $REPO_DIR/.env << 'EOF'
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

echo "✓ Environment file created"

# Step 5: Install dependencies and build
echo ""
echo "📦 Step 5: Installing dependencies..."
npm install --production=false
echo "✓ Dependencies installed"

echo ""
echo "🏗️ Step 6: Building application..."
npm run build
echo "✓ Application built"

# Step 7: Create symbolic links for static files
echo ""
echo "🔗 Step 7: Creating symbolic links..."
ln -sf $REPO_DIR/.next $SUBDOMAIN_DIR/public_html/.next 2>/dev/null
ln -sf $REPO_DIR/public $SUBDOMAIN_DIR/public_html/public 2>/dev/null
echo "✓ Symbolic links created"

# Step 8: Show next steps
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Server setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps in cPanel:"
echo ""
echo "1. Create subdomain in cPanel:"
echo "   - Go to Domains → Subdomains"
echo "   - Subdomain: app"
echo "   - Document Root: /home/inmoti87/app.pennkraft.com/public_html"
echo ""
echo "2. Configure Node.js app:"
echo "   - Go to Software → Setup Node.js App"
echo "   - Update Application URL to: app.pennkraft.com"
echo "   - Note the PORT number (update .htaccess if not 30000)"
echo "   - Click RESTART"
echo ""
echo "3. Test the deployment:"
echo "   - Visit https://app.pennkraft.com"
echo "   - Check logs at: tail -f ~/logs/*.log"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"