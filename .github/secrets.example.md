# GitHub Secrets Configuration

To deploy to cPanel using GitHub Actions, you need to configure the following secrets in your GitHub repository settings:

## Required Secrets

Go to your repository → Settings → Secrets and variables → Actions → New repository secret

### FTP/cPanel Secrets (InMotion Hosting)
- **FTP_HOST**: `inmotionestimating.com`
- **FTP_USERNAME**: `admin@inmotionestimating.com`
- **FTP_PASSWORD**: Your cPanel password (keep secure, do not share)
- **FTP_PORT**: `21` (or `22` for SFTP if available)
- **FTP_SERVER_DIR**: `/home/inmoti87/pennkraft.com/portal/`

### Database Secrets
- **POSTGRES_DATABASE_URL**: PostgreSQL connection string
  ```
  postgresql://inmoti87_pennkraft:your_db_password@localhost:5432/inmoti87_portal?schema=public
  ```

### Application Secrets
- **PRODUCTION_URL**: `https://inmotionestimating.com/portal`
- **NEXTAUTH_SECRET**: Secure random string for NextAuth.js
  - Generate with: `openssl rand -base64 32`

### Optional Secrets
- **EMAIL_SERVER_PASSWORD**: If using email notifications
- **GOOGLE_CLIENT_ID**: For Google OAuth
- **GOOGLE_CLIENT_SECRET**: For Google OAuth
- **SENTRY_DSN**: For error monitoring

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the secret name (exactly as listed above)
6. Enter the secret value
7. Click **Add secret**

## Security Notes

- Never commit secrets to your repository
- Use strong, unique passwords
- Rotate secrets regularly
- Consider using GitHub Environments for staging/production separation
- Enable 2FA on your GitHub account

## Testing Deployment

After configuring all secrets:

1. Push to main branch to trigger automatic deployment
2. Or manually trigger: Actions → Deploy to cPanel → Run workflow