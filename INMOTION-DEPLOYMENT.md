# InMotion Hosting Deployment Guide - Pennkraft Portal

This guide is specifically configured for your InMotion Hosting cPanel account.

## 🔑 Your Account Information

- **Domain**: pennkraft.com (with inmotionestimating.com)
- **cPanel Username**: admin@inmotionestimating.com
- **Contact Email**: ipenn@pennkraft.com
- **Home Directory**: /home/inmoti87/
- **Application Directory**: /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal/
- **Git Repository**: /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal

## 📋 Pre-Deployment Checklist

- [ ] PostgreSQL database created in cPanel
- [ ] Node.js application set up in cPanel
- [ ] GitHub repository configured
- [ ] Local development environment working

## 🗄️ Step 1: PostgreSQL Database Setup

### In your InMotion cPanel:

1. **Navigate to**: Databases → PostgreSQL Databases
2. **Create Database**:
   - Database name: `inmoti87_portal`
3. **Create User**:
   - Username: `inmoti87_pennkraft`
   - Password: (generate a strong password)
4. **Add User to Database**:
   - Select the user and database
   - Grant ALL PRIVILEGES

### Your Database Connection String:
```
postgresql://inmoti87_pennkraft:[YOUR_DB_PASSWORD]@localhost:5432/inmoti87_portal?schema=public
```

## 🚀 Step 2: Node.js Application Setup

### In cPanel → Software → Setup Node.js App:

1. **Create Application**:
   - Node.js version: `20.x` (or highest available)
   - Application mode: `Production`
   - Application root: `/home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal`
   - Application URL: `portal` (for pennkraft.com/portal)
   - Application startup file: `npm start`

2. **Environment Variables** (Add these):
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://inmoti87_pennkraft:[YOUR_DB_PASSWORD]@localhost:5432/inmoti87_portal
   NEXTAUTH_URL=https://inmotionestimating.com/portal
   NEXTAUTH_SECRET=[Generate with: openssl rand -base64 32]
   CONTACT_EMAIL=ipenn@pennkraft.com
   ```

## 📦 Step 3: Deploy Files

### Option A: GitHub Actions (Recommended)

1. **Configure GitHub Secrets**:

   Go to your GitHub repo → Settings → Secrets → Actions

   Add these secrets:
   - `FTP_HOST`: inmotionestimating.com
   - `FTP_USERNAME`: admin@inmotionestimating.com
   - `FTP_PASSWORD`: [Your cPanel password]
   - `FTP_PORT`: 21
   - `FTP_SERVER_DIR`: /home/inmoti87/pennkraft.com/portal/
   - `POSTGRES_DATABASE_URL`: [Your full PostgreSQL connection string]
   - `PRODUCTION_URL`: https://inmotionestimating.com/portal
   - `NEXTAUTH_SECRET`: [Your generated secret]

2. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to InMotion hosting"
   git push origin main
   ```

### Option B: Manual FTP Upload

1. **Build Locally**:
   ```bash
   # Create production env file
   cp .env.production.example .env.production
   # Edit .env.production with your values

   # Run deployment script
   ./scripts/deploy-local.sh
   ```

2. **Upload via FTP**:
   - FTP Client: FileZilla or similar
   - Host: inmotionestimating.com
   - Username: admin@inmotionestimating.com
   - Password: [Your cPanel password]
   - Port: 21
   - Directory: /home/inmoti87/pennkraft.com/portal/

   Upload contents of `deploy-package/` folder

## 🔧 Step 4: Configure & Start

1. **SSH into your server** (if available):
   ```bash
   ssh admin@inmotionestimating.com
   cd ~/pennkraft.com/portal
   ```

2. **Install Dependencies**:
   - In cPanel Node.js App → Click "Run NPM Install"
   - Or via SSH: `npm install --production`

3. **Run Database Migrations**:
   ```bash
   npx prisma migrate deploy --schema=./prisma/schema-postgres.prisma
   ```

4. **Start Application**:
   - In cPanel Node.js App → Click "Start"

## ✅ Step 5: Verification

Test these features:

1. **Main Site**: https://pennkraft.com
2. **Portal**: https://pennkraft.com/portal
3. **Login**: Test authentication
4. **Database**: Verify data operations

## 🔍 Monitoring & Logs

### Check Application Status:
- cPanel → Software → Setup Node.js App → View Status

### View Logs:
```bash
# Application logs
tail -f ~/nodelogs/pennkraft-portal/error.log

# Access logs
tail -f ~/nodelogs/pennkraft-portal/access.log
```

## 🆘 Troubleshooting

### Common Issues:

1. **502 Bad Gateway**:
   - Check Node.js app is running
   - Verify port configuration
   - Check .htaccess file

2. **Database Connection Failed**:
   - Verify PostgreSQL credentials
   - Check database exists
   - Confirm user privileges

3. **Session/Auth Issues**:
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain

## 📞 InMotion Support

If you need hosting assistance:
- **Support Portal**: Login to InMotion AMP
- **Documentation**: InMotion Support Center
- **Your Contact**: ipenn@pennkraft.com

## 🔄 Updates & Maintenance

To update the application:

1. **Via GitHub**:
   - Push changes to main branch
   - GitHub Actions deploys automatically

2. **Manual Update**:
   - Build new version locally
   - Upload via FTP
   - Restart Node.js app in cPanel

## 🔐 Security Notes

- **Never commit** passwords or secrets to Git
- **Use strong passwords** for database and cPanel
- **Enable 2FA** on GitHub and cPanel when available
- **Regular backups** of database and files
- **Monitor** access logs for suspicious activity

---

**Project**: Pennkraft Client Portal
**Domain**: inmotionestimating.com
**Last Updated**: September 2025