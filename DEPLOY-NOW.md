# 🚀 Deploy to www.pennkraft.com/portal - Quick Steps

## On Your Server (cPanel Terminal):

### 1. Pull Latest Code
```bash
cd /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal
git pull origin main
```

### 2. Copy .htaccess to public_html
```bash
cp public/.htaccess /home/inmoti87/pennkraft.com/public_html/.htaccess
```

### 3. Update .htaccess with Correct Port
After Node.js app starts, it will show a port number (e.g., 30000, 30001, etc.)
Edit the .htaccess file and replace `30000` with your actual port number:
```bash
nano /home/inmoti87/pennkraft.com/public_html/.htaccess
# Replace all instances of :30000 with your actual port
```

### 4. Build the Application
```bash
cd /home/inmoti87/pennkraft.com/repositories/Pennkraft-client-portal
export PATH=/opt/alt/alt-nodejs24/root/usr/bin:$PATH
npm install
npm run build
```

### 5. Update Environment Variables in cPanel
Go to cPanel → Node.js → Your App → Environment Variables

Update these to use www:
- `NEXTAUTH_URL` = `https://www.pennkraft.com/portal`
- `NEXT_PUBLIC_APP_URL` = `https://www.pennkraft.com/portal`

Keep these as-is:
- `DATABASE_URL` = `postgresql://inmoti87_pennkraft:Q6_Ou%5D9%23ZhiH@localhost:5432/inmoti87_portal?schema=public`
- `NEXTAUTH_SECRET` = `0SIhqri5f5ac6tDP2Y5hzB63ph/LmQz63TeyH4W/9DY=`
- `NODE_ENV` = `production`

### 6. Restart the Application
In cPanel → Node.js → Click **RESTART**

### 7. Note the Port Number
After restart, the Node.js app will show which port it's running on.
Update the .htaccess file if the port changed.

## Test Your Deployment

1. Visit: https://www.pennkraft.com/portal
2. Try logging in with test credentials
3. Check all pages load correctly

## Troubleshooting

### If you see "502 Bad Gateway" or "Service Unavailable":
1. Check the Node.js app is running in cPanel
2. Verify the port number in .htaccess matches the Node.js app port
3. Check logs: `tail -f /home/inmoti87/logs/passenger.log`

### If you see "Hello, my world again":
The Node.js app is running but not serving Next.js. Run the build steps again.

### If redirects aren't working:
Make sure .htaccess is in `/home/inmoti87/pennkraft.com/public_html/` not in the repositories folder.

## Port Number Reference
The Node.js app port is dynamically assigned by cPanel. Common ports:
- 30000, 30001, 30002, etc.

You can find your port by:
1. Checking cPanel → Node.js → Your App details
2. Looking at the Application URL (it may show the port)
3. Checking the passenger log files

---

Once deployed, future updates only require:
1. `git push` from local
2. `git pull` on server
3. `npm run build`
4. Restart in cPanel