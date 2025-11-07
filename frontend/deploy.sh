#!/bin/bash

# TropicalParking Frontend Deployment Script
# This script automates the deployment process for the static frontend

set -e

echo "🌴 TropicalParking Frontend Deployment Script"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Prompt for deployment target
echo "Select deployment target:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) AWS S3"
echo "4) Local/Custom Server"
read -p "Enter choice [1-4]: " deploy_target

# Verify files exist
echo ""
echo -e "${GREEN}📋 Verifying files...${NC}"
required_files=("index.html" "app.js" "style.css" "config.js")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}Error: Required file '$file' not found${NC}"
        exit 1
    fi
    echo "  ✓ $file"
done

# Update config for production
echo ""
echo -e "${YELLOW}⚠️  Remember to update config.js with production values:${NC}"
echo "  - apiUrl: https://api.tropicalparking.com/api"
echo "  - stripePublicKey: pk_live_..."
echo "  - recaptchaSiteKey: Your production key"
read -p "Have you updated config.js? (yes/no): " config_updated
if [ "$config_updated" != "yes" ]; then
    echo -e "${RED}Please update config.js before deploying${NC}"
    exit 1
fi

case $deploy_target in
    1)
        # Netlify deployment
        echo ""
        echo -e "${GREEN}🚀 Deploying to Netlify...${NC}"

        # Check if Netlify CLI is installed
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}Netlify CLI not found. Installing...${NC}"
            npm install -g netlify-cli
        fi

        # Deploy
        netlify deploy --prod --dir .

        echo ""
        echo -e "${GREEN}✅ Deployed to Netlify${NC}"
        echo "Remember to configure custom domain in Netlify dashboard"
        ;;

    2)
        # Vercel deployment
        echo ""
        echo -e "${GREEN}🚀 Deploying to Vercel...${NC}"

        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
            npm install -g vercel
        fi

        # Deploy
        vercel --prod

        echo ""
        echo -e "${GREEN}✅ Deployed to Vercel${NC}"
        ;;

    3)
        # AWS S3 deployment
        echo ""
        echo -e "${GREEN}🚀 Deploying to AWS S3...${NC}"

        # Check if AWS CLI is installed
        if ! command -v aws &> /dev/null; then
            echo -e "${RED}AWS CLI not found. Please install it first.${NC}"
            exit 1
        fi

        read -p "Enter S3 bucket name: " bucket_name

        # Sync to S3
        aws s3 sync . s3://$bucket_name --acl public-read --exclude ".git/*" --exclude "*.sh" --exclude "node_modules/*"

        # Invalidate CloudFront cache (if using CloudFront)
        read -p "Do you have a CloudFront distribution? (yes/no): " has_cloudfront
        if [ "$has_cloudfront" == "yes" ]; then
            read -p "Enter CloudFront distribution ID: " distribution_id
            aws cloudfront create-invalidation --distribution-id $distribution_id --paths "/*"
        fi

        echo ""
        echo -e "${GREEN}✅ Deployed to AWS S3${NC}"
        ;;

    4)
        # Local/Custom server deployment
        echo ""
        echo -e "${GREEN}📦 Preparing files for manual deployment...${NC}"

        # Create deployment package
        DEPLOY_DIR="tropicalparking-frontend-$(date +%Y%m%d-%H%M%S)"
        mkdir -p $DEPLOY_DIR

        # Copy files
        cp -r *.html *.css *.js $DEPLOY_DIR/ 2>/dev/null || true

        # Create archive
        tar -czf $DEPLOY_DIR.tar.gz $DEPLOY_DIR

        echo ""
        echo -e "${GREEN}✅ Deployment package created: $DEPLOY_DIR.tar.gz${NC}"
        echo ""
        echo "To deploy to your server:"
        echo "1. Upload $DEPLOY_DIR.tar.gz to your server"
        echo "2. Extract: tar -xzf $DEPLOY_DIR.tar.gz"
        echo "3. Move files to web root: mv $DEPLOY_DIR/* /var/www/html/"
        echo "4. Configure your web server (Nginx/Apache)"

        # Clean up
        rm -rf $DEPLOY_DIR
        ;;

    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Test deployment
echo ""
echo -e "${GREEN}🧪 Testing deployment...${NC}"
echo "Please verify the following:"
echo "  ✓ Website loads correctly"
echo "  ✓ API connections work"
echo "  ✓ Animations are smooth"
echo "  ✓ Responsive design works on mobile"
echo "  ✓ Forms submit properly"
echo "  ✓ Authentication works"
echo ""

echo -e "${GREEN}🎉 Frontend deployment complete!${NC}"
