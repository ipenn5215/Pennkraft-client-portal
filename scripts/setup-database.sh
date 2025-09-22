#!/bin/bash

# Database setup script for PostgreSQL migration

echo "🗄️  PostgreSQL Database Setup Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check for .env.production
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production not found!${NC}"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load environment
export $(cat .env.production | grep -v '^#' | xargs)

echo -e "${BLUE}📋 Database Configuration:${NC}"
echo "Connection: $DATABASE_URL"
echo ""

# Generate Prisma client
echo -e "${YELLOW}1. Generating Prisma Client...${NC}"
npx prisma generate --schema=./prisma/schema-postgres.prisma

# Create database backup of SQLite (if exists)
if [ -f prisma/dev.db ]; then
    echo -e "${YELLOW}2. Creating backup of existing SQLite database...${NC}"
    cp prisma/dev.db "prisma/backup-$(date +%Y%m%d-%H%M%S).db"
    echo -e "${GREEN}   ✅ Backup created${NC}"
else
    echo -e "${YELLOW}2. No existing SQLite database to backup${NC}"
fi

# Push schema to PostgreSQL
echo -e "${YELLOW}3. Creating database schema...${NC}"
npx prisma db push --schema=./prisma/schema-postgres.prisma --skip-generate

# Create initial migration
echo -e "${YELLOW}4. Creating initial migration...${NC}"
npx prisma migrate dev --schema=./prisma/schema-postgres.prisma --name initial_setup --create-only

# Deploy migrations
echo -e "${YELLOW}5. Deploying migrations...${NC}"
npx prisma migrate deploy --schema=./prisma/schema-postgres.prisma

# Seed database (optional)
echo -e "${YELLOW}6. Seeding database (if seed script exists)...${NC}"
if [ -f prisma/seed.ts ] || [ -f prisma/seed.js ]; then
    npx prisma db seed
    echo -e "${GREEN}   ✅ Database seeded${NC}"
else
    echo "   No seed file found (optional)"
fi

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify database connection in your application"
echo "2. Test authentication and data operations"
echo "3. Monitor for any migration issues"

# Show database info
echo ""
echo -e "${BLUE}📊 Database Status:${NC}"
npx prisma db pull --schema=./prisma/schema-postgres.prisma --print