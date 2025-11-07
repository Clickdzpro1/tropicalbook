#!/bin/bash

# TropicalParking Backend Deployment Script
# This script automates the deployment process for the backend application

set -e

echo "🌴 TropicalParking Backend Deployment Script"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}Please do not run this script as root${NC}"
    exit 1
fi

# Prompt for deployment type
echo "Select deployment type:"
echo "1) Development"
echo "2) Production"
read -p "Enter choice [1-2]: " deploy_type

if [ "$deploy_type" == "2" ]; then
    ENV="production"
    echo -e "${YELLOW}⚠️  Deploying to PRODUCTION${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Deployment cancelled"
        exit 0
    fi
else
    ENV="development"
    echo "Deploying to DEVELOPMENT"
fi

# Check if .env file exists
if [ "$ENV" == "production" ] && [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    exit 1
fi

# Pull latest code
echo ""
echo -e "${GREEN}📥 Pulling latest code...${NC}"
git pull origin main

# Install dependencies
echo ""
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install --production

# Create logs directory if it doesn't exist
echo ""
echo -e "${GREEN}📁 Creating logs directory...${NC}"
mkdir -p logs

# Copy environment file
if [ "$ENV" == "production" ]; then
    echo ""
    echo -e "${GREEN}⚙️  Setting up production environment...${NC}"
    cp .env.production .env
fi

# Run database migrations if needed
echo ""
echo -e "${GREEN}🗄️  Database is managed by Supabase - skipping migrations${NC}"

# Restart application with PM2
echo ""
echo -e "${GREEN}🔄 Restarting application...${NC}"

if [ "$ENV" == "production" ]; then
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        echo -e "${RED}PM2 is not installed. Installing now...${NC}"
        npm install -g pm2
    fi

    # Stop existing process
    pm2 stop tropicalparking-api 2>/dev/null || true

    # Start with ecosystem config
    pm2 start ecosystem.config.js --env production
    pm2 save

    # Show status
    pm2 list
else
    # Development - just use npm
    npm run dev &
fi

# Health check
echo ""
echo -e "${GREEN}🏥 Performing health check...${NC}"
sleep 5

if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is healthy!${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
    exit 1
fi

# Display logs
if [ "$ENV" == "production" ]; then
    echo ""
    echo -e "${GREEN}📊 Recent logs:${NC}"
    pm2 logs tropicalparking-api --lines 20 --nostream
fi

# Deployment complete
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Application URLs:"
if [ "$ENV" == "production" ]; then
    echo "  API: https://api.tropicalparking.com"
    echo "  Health: https://api.tropicalparking.com/health"
else
    echo "  API: http://localhost:5000"
    echo "  Health: http://localhost:5000/health"
fi
echo ""
echo "Useful commands:"
echo "  View logs:     pm2 logs tropicalparking-api"
echo "  Restart:       pm2 restart tropicalparking-api"
echo "  Stop:          pm2 stop tropicalparking-api"
echo "  Status:        pm2 status"
echo ""
