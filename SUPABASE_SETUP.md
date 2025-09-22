# Supabase Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create a new project (free tier is fine)
5. Wait for project to initialize (~2 minutes)

### Step 2: Get Your Credentials
Once your project is ready:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with: `eyJ...`)
   - **Service Role Key** (keep this secret!)

### Step 3: Set Up Environment
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

### Step 4: Create Database Tables
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of: `/supabase/complete-setup.sql`
4. Click **Run** (green play button)
5. You should see "Database schema created successfully! 🎉"

### Step 5: Create Test Users (Optional)
For testing, create these users in Supabase Auth:

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Create admin user:
   - Email: `admin@pennkraft.com`
   - Password: `Admin123!@#`
   - User metadata: `{"full_name": "Admin User", "role": "admin"}`

4. Create demo customer:
   - Email: `demo@pennkraft.com`
   - Password: `Demo123!@#`
   - User metadata: `{"full_name": "Demo Customer", "role": "customer", "company": "Demo Construction"}`

### Step 6: Add Sample Data (Optional)
If you want sample projects and estimates:
1. Create the users above first
2. Get their user IDs from Authentication → Users
3. Update the IDs in `/supabase/seed-data.sql`
4. Run the seed-data.sql in SQL Editor

### Step 7: Test the Connection
1. Restart your Next.js dev server:
```bash
npm run dev
```

2. Try logging in at `/portal/login` with:
   - Email: `demo@pennkraft.com`
   - Password: `Demo123!@#`

## Database Structure

### Tables Created:
- **users** - User profiles (extends Supabase auth)
- **projects** - Construction/service projects
- **estimates** - Project quotes and estimates
- **media** - Gallery images and videos
- **notifications** - User alerts and messages
- **activity_log** - Audit trail
- **dashboard_metrics** - Admin dashboard view

### Security Features:
- Row Level Security (RLS) enabled
- Users can only see their own data
- Admins can see everything
- Public media for gallery
- Automatic timestamps

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file has the correct keys
- Make sure you're using the Anon key (not Service key) for NEXT_PUBLIC_SUPABASE_ANON_KEY

### "User not found" error
- Make sure you created the user in Supabase Authentication
- Check that the email matches exactly

### Tables not showing data
- Run the complete-setup.sql first
- Then create users through Supabase Auth
- Finally run seed-data.sql if you want sample data

### Can't login
- Check browser console for errors
- Verify Supabase project is running (not paused)
- Check that RLS policies are created

## Next Steps

Once connected, you'll have:
- ✅ Real authentication (not mock)
- ✅ Persistent data storage
- ✅ User sessions
- ✅ File uploads for gallery
- ✅ Real-time updates
- ✅ Admin dashboard with real metrics

## Support

If you run into issues:
1. Check Supabase logs: Dashboard → Logs → API
2. Test your connection: Dashboard → SQL Editor → Run `SELECT * FROM users;`
3. Verify RLS: Dashboard → Authentication → Policies

The database is now ready for production use!