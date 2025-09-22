#!/bin/bash

# Local deployment script for manual deployment to cPanel
# This script prepares the build and can be used for manual FTP upload

echo "🚀 Starting local deployment preparation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production not found!${NC}"
    echo "Please create .env.production from .env.production.example"
    exit 1
fi

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

echo -e "${YELLOW}🗄️  Generating Prisma client for PostgreSQL...${NC}"
npx prisma generate --schema=./prisma/schema-postgres.prisma

echo -e "${YELLOW}📂 Creating deployment package...${NC}"
rm -rf deploy-package
mkdir -p deploy-package

# Copy necessary files
cp -r .next deploy-package/
cp -r public deploy-package/
cp package.json deploy-package/
cp package-lock.json deploy-package/
cp next.config.js deploy-package/

# Copy Prisma files
mkdir -p deploy-package/prisma
cp prisma/schema-postgres.prisma deploy-package/prisma/schema.prisma

# Create start script
cat > deploy-package/start.sh << 'EOF'
#!/bin/bash
export NODE_ENV=production
npm start
EOF
chmod +x deploy-package/start.sh

# Create deployment info
cat > deploy-package/DEPLOY_INFO.txt << EOF
Deployment Package Created: $(date)
Node Version Required: 20.x
Next.js Version: $(cat package.json | grep '"next"' | cut -d'"' -f4)

To deploy:
1. Upload all files to your cPanel directory
2. Set up Node.js application in cPanel
3. Run npm install in the terminal
4. Configure environment variables
5. Start the application
EOF

echo -e "${GREEN}✅ Deployment package created in 'deploy-package' directory${NC}"
echo ""
echo "Next steps:"
echo "1. Upload the contents of 'deploy-package' to your cPanel"
echo "2. Configure Node.js application in cPanel"
echo "3. Set up PostgreSQL database"
echo "4. Configure environment variables"
echo "5. Start the application"