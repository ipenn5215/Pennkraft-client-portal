# Pennkraft Portal - Deployment Guide

This guide covers deploying the Pennkraft Client Portal to cPanel with PostgreSQL database using GitHub Actions.

## 📋 Prerequisites

1. **cPanel Account** with:
   - Node.js application support (version 20.x)
   - PostgreSQL database access
   - FTP/SSH access
   - Sufficient disk space and bandwidth

2. **GitHub Repository**:
   - Code pushed to GitHub
   - Admin access to configure secrets

3. **Local Development**:
   - Node.js 20.x installed
   - npm or yarn package manager
   - Git configured

## 🗄️ Database Setup (PostgreSQL on cPanel)

### Step 1: Create PostgreSQL Database

1. Login to cPanel
2. Navigate to **Databases** → **PostgreSQL Databases**
3. Create new database:
   - Database name: `pennkraf_portal`
4. Create database user:
   - Username: `pennkraf_user`
   - Strong password (save this!)
5. Add user to database with ALL privileges

### Step 2: Configure Database Connection

Your PostgreSQL connection string format:
```
postgresql://pennkraf_user:password@localhost:5432/pennkraf_portal?schema=public
```

### Step 3: Run Database Migrations

```bash
# From local machine (after configuring .env.production)
./scripts/setup-database.sh
```

## 🔐 GitHub Configuration

### Step 1: Configure Repository Secrets

Go to: GitHub Repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value Example | Description |
|------------|---------------|-------------|
| `FTP_HOST` | `ftp.yourdomain.com` | cPanel server hostname |
| `FTP_USERNAME` | `cpaneluser` | cPanel username |
| `FTP_PASSWORD` | `********` | cPanel/FTP password |
| `FTP_PORT` | `21` | FTP port (21 or 22 for SFTP) |
| `FTP_SERVER_DIR` | `/home/user/pennkraft/` | Target directory |
| `POSTGRES_DATABASE_URL` | `postgresql://...` | Full connection string |
| `PRODUCTION_URL` | `https://domain.com/portal` | Your production URL |
| `NEXTAUTH_SECRET` | `random-32-char-string` | Generate with `openssl rand -base64 32` |

### Step 2: GitHub Actions Workflow

The workflow (`.github/workflows/deploy-cpanel.yml`) will:
1. Build the Next.js application
2. Generate Prisma client for PostgreSQL
3. Create deployment package
4. Deploy via FTP to cPanel

## 🚀 Deployment Methods

### Option 1: Automatic Deployment (GitHub Actions)

**Setup (One Time)**:
1. Configure all GitHub secrets
2. Push code to GitHub
3. Workflow triggers automatically on push to main branch

**Deploy**:
```bash
# Automatic deployment on push to main
git add .
git commit -m "Deploy to production"
git push origin main
```

**Manual Trigger**:
- Go to Actions tab → Deploy to cPanel → Run workflow

### Option 2: Manual Deployment (Local Build + FTP)

**Step 1: Prepare Production Build**
```bash
# Create .env.production from template
cp .env.production.example .env.production
# Edit .env.production with your values

# Run local deployment script
./scripts/deploy-local.sh
```

**Step 2: Upload Files**
- Use FTP client (FileZilla, etc.)
- Upload contents of `deploy-package/` to cPanel directory
- Or use command line:
```bash
lftp -u username,password ftp.yourdomain.com
mirror -R deploy-package/ /home/username/pennkraft-portal/
```

## 📱 cPanel Node.js Application Setup

### First-Time Setup

1. **Login to cPanel** → **Software** → **Setup Node.js App**

2. **Create Application**:
   - Node.js version: `20.x`
   - Application mode: `Production`
   - Application root: `/home/username/pennkraft-portal`
   - Application URL: `portal` (or your subdomain)
   - Application startup file: `npm start`

3. **Environment Variables** (Add in cPanel):
   ```
   NODE_ENV=production
   DATABASE_URL=postgresql://...
   NEXTAUTH_URL=https://yourdomain.com/portal
   NEXTAUTH_SECRET=your-secret-here
   ```

4. **Install Dependencies**:
   - Click "Run NPM Install" button in cPanel
   - Or via SSH: `cd ~/pennkraft-portal && npm install`

5. **Start Application**:
   - Click "Start" button in cPanel
   - Application will run on assigned port

### Updating Existing Deployment

1. Deploy new code via GitHub Actions or manual FTP
2. In cPanel Node.js app manager:
   - Click "Restart" button
   - Or touch `~/pennkraft-portal/tmp/restart.txt`

## 🔧 Configuration Files

### Environment Variables

**Development** (`.env.local`):
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret"
```

**Production** (`.env.production`):
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
NEXTAUTH_URL="https://yourdomain.com/portal"
NEXTAUTH_SECRET="production-secret-32-chars"
```

### Database Schema

- **Development**: SQLite (`prisma/schema.prisma`)
- **Production**: PostgreSQL (`prisma/schema-postgres.prisma`)

## 📊 Monitoring & Maintenance

### Check Application Status

**Via cPanel**:
- Software → Setup Node.js App → View application status

**Via SSH**:
```bash
# Check if app is running
ps aux | grep node

# View application logs
tail -f ~/nodelogs/pennkraft-portal/error.log
tail -f ~/nodelogs/pennkraft-portal/access.log
```

### Database Maintenance

```bash
# Backup database
pg_dump pennkraf_portal > backup-$(date +%Y%m%d).sql

# Check database status
npx prisma studio --schema=./prisma/schema-postgres.prisma
```

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| App not starting | Check Node.js version, verify env variables |
| Database connection failed | Verify PostgreSQL credentials and connection string |
| 500 errors | Check error logs, verify file permissions |
| Assets not loading | Check public directory, verify build output |
| Session issues | Verify NEXTAUTH_SECRET is set correctly |

## 🔄 Rollback Procedure

If deployment fails:

1. **Via GitHub**:
   - Revert to previous commit
   - Push to trigger re-deployment

2. **Manual Rollback**:
   ```bash
   # Keep backups before deploying
   cp -r pennkraft-portal pennkraft-portal.backup

   # To rollback
   rm -rf pennkraft-portal
   mv pennkraft-portal.backup pennkraft-portal
   touch pennkraft-portal/tmp/restart.txt
   ```

## 📝 Deployment Checklist

Before deploying:

- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] GitHub secrets configured
- [ ] cPanel Node.js app created
- [ ] PostgreSQL database created
- [ ] Backup of current production (if updating)

After deploying:

- [ ] Application loads correctly
- [ ] Authentication works
- [ ] Database queries functioning
- [ ] All pages accessible
- [ ] Forms submitting correctly
- [ ] File uploads working (if applicable)

## 🆘 Support & Resources

- **cPanel Documentation**: [cPanel Node.js Guide](https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/)
- **Next.js Deployment**: [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- **Prisma PostgreSQL**: [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- **GitHub Actions**: [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📞 Emergency Contacts

Document your hosting provider's support information here:
- Hosting Support:
- Database Admin:
- Domain Registrar:

---

**Last Updated**: September 2025
**Version**: 1.0.0