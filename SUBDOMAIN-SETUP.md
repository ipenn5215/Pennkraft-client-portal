# 🌐 Setting Up app.pennkraft.com Subdomain

## Quick Setup Guide for cPanel

### Step 1: Create Subdomain in cPanel

1. **Login to cPanel**
2. Go to **Domains → Subdomains**
3. Create subdomain:
   - Subdomain: `app`
   - Domain: `pennkraft.com`
   - Document Root: `/home/inmoti87/app.pennkraft.com/public_html`
   - Click **Create**

### Step 2: Upload and Run Setup Script

#### Option A: Via cPanel Terminal
```bash
# 1. Go to cPanel → Terminal
# 2. Upload the setup script:
cd /home/inmoti87
nano setup-subdomain.sh
# Paste the contents of scripts/setup-subdomain.sh
chmod +x setup-subdomain.sh
./setup-subdomain.sh
```

#### Option B: Via File Manager
1. Upload `scripts/setup-subdomain.sh` to `/home/inmoti87/`
2. Set permissions to 755 (executable)
3. Run via Terminal or Cron Job

### Step 3: Configure Node.js App in cPanel

1. Go to **Software → Setup Node.js App**
2. Find your existing app or create new
3. Update settings:
   - Application URL: `app.pennkraft.com`
   - Application Root: `/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal`
   - Application Startup File: `npm start`
4. Note the PORT number assigned (e.g., 30000)

### Step 4: Update .htaccess with Correct Port

Edit `/home/inmoti87/app.pennkraft.com/public_html/.htaccess`:
```apache
# Replace 30000 with your actual Node.js port
RewriteRule ^(.*)$ http://127.0.0.1:30000/$1 [P,L]
```

### Step 5: Update DNS (if needed)

If subdomain doesn't resolve automatically:
1. Go to **Domains → Zone Editor**
2. Add CNAME record:
   - Name: `app`
   - Record: `pennkraft.com`

### Step 6: Deploy Latest Code

```bash
cd /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal
git pull origin main
export PATH=/opt/alt/alt-nodejs24/root/usr/bin:$PATH
npm install
npm run build
```

### Step 7: Restart Node.js App

In cPanel → Node.js → Click **RESTART**

## Testing

### Verify Subdomain
```bash
# Check DNS resolution
nslookup app.pennkraft.com

# Test HTTPS
curl -I https://app.pennkraft.com
```

### Check Application
1. Visit https://app.pennkraft.com
2. Should see the portal login page
3. Test login functionality
4. Verify all pages load correctly

## File Structure After Setup

```
/home/inmoti87/
├── pennkraft.com/
│   ├── public_html/           # Main site (www.pennkraft.com)
│   │   └── .htaccess          # Main site rules
│   └── repositories/
│       └── Pennkraft-client-portal/  # Node.js app
│           ├── .next/
│           ├── public/
│           ├── .env.production
│           └── package.json
└── app.pennkraft.com/
    └── public_html/           # Subdomain root
        ├── .htaccess         # Proxy to Node.js
        └── [symbolic links to app files]
```

## Environment Variables

The app uses these URLs:
- `NEXT_PUBLIC_APP_URL="https://app.pennkraft.com"`
- `NEXT_PUBLIC_MAIN_SITE_URL="https://www.pennkraft.com"`
- `NEXTAUTH_URL="https://app.pennkraft.com"`

## Troubleshooting

### 502 Bad Gateway
- Check Node.js app is running
- Verify port number in .htaccess matches Node.js port
- Check `tail -f /home/inmoti87/logs/app.pennkraft.com/error.log`

### Subdomain Not Loading
- Verify DNS propagation (can take 24 hours)
- Check subdomain exists in cPanel
- Verify .htaccess proxy rules

### Application Errors
- Check Node.js logs in cPanel
- Verify environment variables are set
- Ensure database connection is working

## SSH Access Setup (Optional but Recommended)

To enable direct server management:

1. **In cPanel**: Security → SSH Access
2. **Generate SSH Key** if needed
3. **Enable SSH** (may need to contact InMotion support)
4. **Connect**:
   ```bash
   ssh inmoti87@pennkraft.com -p 22
   # or with key
   ssh -i ~/.ssh/your-key inmoti87@pennkraft.com
   ```

Once SSH is enabled, you can provide the connection details for direct server management.

## Automated Deployment

The webhook system remains the same, just update the deployment URL:
- GitHub Webhook: `https://app.pennkraft.com/deploy-webhook.php`
- Or use existing: `https://www.pennkraft.com/deploy-webhook.php`

---

**Need Help?**
- Check cPanel error logs
- Contact InMotion support for server issues
- Review Node.js app logs for application errors