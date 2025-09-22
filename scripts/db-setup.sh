#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up Pennkraft Local Database${NC}"
echo "======================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker.${NC}"
    exit 1
fi

# Start PostgreSQL with Docker Compose
echo -e "${YELLOW}Starting PostgreSQL container...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if database is accessible
until docker exec pennkraft-db pg_isready -U pennkraft_user -d pennkraft_dev > /dev/null 2>&1; do
    echo "Waiting for database..."
    sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"

# Generate Prisma Client
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

# Run migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npx prisma migrate dev --name init

# Seed the database (optional)
if [ -f "prisma/seed.ts" ]; then
    echo -e "${YELLOW}Seeding database...${NC}"
    npx prisma db seed
fi

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo "Database is running at: postgresql://localhost:5432/pennkraft_dev"
echo "Adminer is available at: http://localhost:8080"
echo ""
echo "To stop the database: docker-compose down"
echo "To view logs: docker-compose logs -f"