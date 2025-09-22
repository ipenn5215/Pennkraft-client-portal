# Automated Deployment Guide for Pennkraft Portal

This guide explains how to set up and use automated deployment for the Pennkraft Portal on InMotion Hosting.

## 🚀 Quick Start

After setup, deployment is automatic! Just:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The server will automatically pull changes, build, and deploy within minutes.

## 📋 Setup Options

### Option 1: GitHub Webhook (Recommended - Instant Deployment)

#### Step 1: Upload Webhook Handler
1. Upload `public/deploy-webhook.php` to `/home/inmoti87/pennkraft.com/public_html/`
2. Set file permissions: `chmod 644 deploy-webhook.php`

#### Step 2: Generate Webhook Secret
```bash
# Generate a strong secret
openssl rand -hex 32
```

#### Step 3: Update Webhook Handler
Edit `deploy-webhook.php` and replace `'your-webhook-secret-here'` with your generated secret.

#### Step 4: Configure GitHub Webhook
1. Go to your GitHub repository → Settings → Webhooks
2. Click "Add webhook"
3. Set:
   - **Payload URL**: `https://pennkraft.com/deploy-webhook.php`
   - **Content type**: `application/json`
   - **Secret**: Your generated secret from Step 2
   - **Events**: Select "Just the push event"
4. Click "Add webhook"

#### Step 5: Upload Deployment Script
```bash
# Upload scripts/deploy.sh to server
scp scripts/deploy.sh admin@inmotionestimating.com:/home/inmoti87/
```

#### Step 6: Make Script Executable
```bash
ssh admin@inmotionestimating.com
chmod +x /home/inmoti87/deploy.sh
```

### Option 2: Cron Job (Scheduled Deployment)

#### Step 1: Upload Deployment Script
Same as webhook Option Step 5

#### Step 2: Setup Cron Job
```bash
# On the server
bash /home/inmoti87/setup-cron.sh
```

Or manually in cPanel:
1. Go to cPanel → Advanced → Cron Jobs
2. Add new cron job:
   - **Schedule**: Every 30 minutes (`*/30 * * * *`)
   - **Command**: `/bin/bash /home/inmoti87/deploy.sh`

### Option 3: GitHub Actions (CI/CD)

#### Step 1: Configure GitHub Secrets
Go to GitHub repository → Settings → Secrets → Actions

Add these secrets:
- `FTP_HOST`: inmotionestimating.com
- `FTP_USERNAME`: admin@inmotionestimating.com
- `FTP_PASSWORD`: Your cPanel password
- `FTP_PORT`: 21
- `FTP_SERVER_DIR`: /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal/
- `POSTGRES_DATABASE_URL`: Your PostgreSQL connection string
- `PRODUCTION_URL`: https://pennkraft.com/portal
- `NEXTAUTH_SECRET`: Your NextAuth secret

#### Step 2: Enable GitHub Actions
The workflow file `.github/workflows/deploy-cpanel.yml` is already configured.
It will run automatically on push to main branch.

## 📁 File Locations

### On Your Local Machine
```
/scripts/
├── deploy.sh           # Main deployment script
├── setup-cron.sh       # Cron job setup
└── build-on-server.sh  # Manual build script

/public/
└── deploy-webhook.php  # GitHub webhook handler
```

### On the Server
```
/home/inmoti87/
├── deploy.sh                               # Deployment script
├── logs/
│   ├── deployment.log                      # Deployment history
│   ├── webhook.log                         # Webhook requests
│   └── deploy-output.log                   # Latest deployment output
└── pennkraft.com/
    ├── public_html/
    │   └── deploy-webhook.php              # Webhook handler
    └── repositories/
        └── Pennkraft-client-portal/        # Your application

```

## 🔍 Monitoring & Logs

### View Deployment Logs
```bash
# SSH into server
ssh admin@inmotionestimating.com

# View latest deployment
tail -f /home/inmoti87/logs/deployment.log

# View webhook requests
tail -f /home/inmoti87/logs/webhook.log

# View deployment output
cat /home/inmoti87/logs/deploy-output.log
```

### Check Application Status
1. Visit https://pennkraft.com/portal
2. Check cPanel → Node.js → Application Status

## 🛠️ Troubleshooting

### Webhook Not Triggering
1. Check GitHub webhook delivery status (Settings → Webhooks → Recent Deliveries)
2. Verify webhook secret matches
3. Check `/home/inmoti87/logs/webhook.log`

### Build Failing
1. Check Node.js version: `node --version` (should be 24.x)
2. Review build logs: `/home/inmoti87/logs/deployment.log`
3. Ensure all dependencies are in package.json

### Application Not Restarting
1. Manually restart in cPanel → Node.js → RESTART
2. Check if `app.js` exists and is touched by deploy script

### Permission Issues
```bash
# Fix script permissions
chmod +x /home/inmoti87/deploy.sh

# Fix log directory
chmod 755 /home/inmoti87/logs
```

## 🔒 Security Best Practices

1. **Use Strong Webhook Secret**: Generate with `openssl rand -hex 32`
2. **Restrict File Permissions**:
   - Scripts: `chmod 750`
   - Logs: `chmod 640`
3. **Monitor Logs**: Regularly check for unauthorized access attempts
4. **Backup Before Deploy**: Consider adding backup step to deploy.sh
5. **Test in Development**: Always test changes locally first

## 📝 Manual Deployment (Fallback)

If automation fails, you can always deploy manually:

```bash
# SSH into server
ssh admin@inmotionestimating.com

# Navigate to app
cd /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal

# Pull latest code
git pull origin main

# Set Node.js 24 path
export PATH=/opt/alt/alt-nodejs24/root/usr/bin:$PATH

# Install and build
npm install
npm run build

# Restart in cPanel
# Go to cPanel → Node.js → RESTART
```

## 🎯 Quick Commands

### Local Development
```bash
npm run dev              # Start dev server
npm run deploy           # Push to GitHub (triggers deployment)
npm run deploy:setup     # Make scripts executable
```

### On Server
```bash
./deploy.sh              # Run deployment manually
crontab -l               # View cron jobs
tail -f logs/deployment.log  # Watch deployment progress
```

## 📧 Support

For issues with:
- **Application**: Check this documentation first
- **Hosting**: Contact InMotion support
- **Repository**: ipenn@pennkraft.com

## 🔄 Update History

- **Initial Setup**: Configured Node.js 24, PostgreSQL, and GitHub repository
- **Automation Added**: Webhook, cron job, and GitHub Actions options
- **Latest Deployment**: Check `/home/inmoti87/logs/deployment.log`

---

**Remember**: After initial setup, all you need to do is `git push` and the deployment happens automatically!