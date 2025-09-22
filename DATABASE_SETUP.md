# Local Database Setup Guide

## Quick Start (SQLite - No Docker Required!)

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run migrations and seed data**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

   This will:
   - Create a SQLite database at `prisma/dev.db`
   - Run all migrations
   - Seed with sample data

3. **Test the database**
   ```bash
   node scripts/test-db.js
   ```

4. **Access the database**
   - **Database file**: `prisma/dev.db`
   - **Prisma Studio** (GUI): `npm run db:studio`
   - Opens at http://localhost:5555

## Test Credentials

After seeding, you can login with:

**Admin Account:**
- Email: `admin@pennkraft.com`
- Password: `admin123`

**Customer Account:**
- Email: `demo@pennkraft.com`
- Password: `demo123`

## Available Commands

```bash
# Database Management
npm run db:migrate   # Run pending migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database (drop all data and re-migrate)
npm run db:studio    # Open Prisma Studio (database GUI)

# Development
npm run dev          # Start Next.js development server
```

## Database Schema

The database includes the following tables:
- **users**: User accounts (customers and admins)
- **projects**: Construction/service projects
- **estimates**: Project quotes and estimates
- **media**: Gallery images and videos
- **notifications**: User alerts and messages
- **activity_log**: Audit trail

## Switching to Production (Supabase)

When ready for production:

1. Save your PostgreSQL schema:
   ```bash
   cp prisma/schema-postgres.prisma prisma/schema.prisma
   ```

2. Update `.env.local` with Supabase credentials:
   ```env
   # Comment out SQLite URL
   # DATABASE_URL="file:./dev.db"

   # Use Supabase URL
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/[DATABASE]"
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. Generate Prisma client for PostgreSQL:
   ```bash
   npx prisma generate
   ```

4. Run migrations on Supabase:
   ```bash
   npx prisma migrate deploy
   ```

The database abstraction layer (`src/lib/database.ts`) handles type differences between SQLite and PostgreSQL transparently.

## Troubleshooting

**Database file locked:**
```bash
# Close any apps using the database (Prisma Studio, etc.)
# Then retry your command
```

**Migration issues:**
```bash
# Reset the database completely
npm run db:reset
# This drops all data and re-runs migrations + seed
```

**Type errors with Prisma:**
```bash
# Regenerate Prisma client
npx prisma generate
```

**SQLite vs PostgreSQL differences:**
- Booleans: SQLite uses 0/1, PostgreSQL uses true/false
- JSON: SQLite stores as string, PostgreSQL has native JSON
- Enums: SQLite uses strings, PostgreSQL has native enums
- The database abstraction layer handles these automatically

## Architecture

### Development (Current)
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   Prisma ORM     │────▶│     SQLite      │
│                 │     │                  │     │   (dev.db)      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Production (Future)
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│   Prisma ORM     │────▶│    Supabase     │
│                 │     │                  │     │  (PostgreSQL)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**: `npm run db:migrate`
3. **Update seed data** if needed in `prisma/seed.ts`
4. **Test locally** with SQLite (no Docker needed!)
5. **Switch to PostgreSQL schema** when ready for production
6. **Deploy to Supabase** for production

## Why SQLite for Development?

- **No Docker required** - Simpler setup
- **Fast** - In-memory operations during development
- **Portable** - Single file database
- **Compatible** - Prisma handles the differences
- **Easy transition** - Switch to PostgreSQL for production

## Docker Alternative (Optional)

If you prefer PostgreSQL locally with Docker:
1. Use `prisma/schema-postgres.prisma`
2. Run `docker-compose up -d`
3. Update `.env.local` with PostgreSQL URL
4. Follow the same migration steps