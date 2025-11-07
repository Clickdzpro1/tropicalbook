# TropicalParking V3 - Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying TropicalParking V3 to production. The application consists of a Node.js/Express backend API and a static HTML/CSS/JavaScript frontend.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Third-Party Services](#third-party-services)
7. [Domain and DNS](#domain-and-dns)
8. [SSL/TLS Certificates](#ssltls-certificates)
9. [Monitoring and Logging](#monitoring-and-logging)
10. [Post-Deployment Verification](#post-deployment-verification)

---

## Prerequisites

### Required Accounts
- Supabase account (database already configured)
- Hosting provider account (Heroku, Railway, DigitalOcean, etc.)
- Domain registrar account
- Stripe account (for payments)
- Google Cloud account (for reCAPTCHA)
- Email service (Gmail with app password or SendGrid)

### Required Tools
- Node.js 18+ and npm
- Git
- PM2 (for process management): `npm install -g pm2`
- SSH access to production server

---

## Environment Configuration

### 1. Backend Environment Variables

The backend requires the following environment variables in production:

**Location**: `/backend/.env.production`

**Critical Variables to Update**:

```bash
# SECURITY: Generate a strong JWT secret (32+ characters)
JWT_SECRET=your_strong_random_secret_here

# Update to your production domain
FRONTEND_URL=https://tropicalparking.com

# Add your Stripe production keys
STRIPE_SECRET_KEY=sk_live_your_stripe_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Configure email service
SMTP_USER=support@tropicalparking.com
SMTP_PASS=your_app_specific_password

# Add your production reCAPTCHA keys
RECAPTCHA_SITE_KEY=your_production_site_key
RECAPTCHA_SECRET_KEY=your_production_secret_key
```

**Generate Strong JWT Secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Frontend Configuration

**Location**: `/frontend/config.js`

Update the production configuration:

```javascript
production: {
  apiUrl: 'https://api.tropicalparking.com/api',
  stripePublicKey: 'pk_live_YOUR_STRIPE_PRODUCTION_KEY',
  recaptchaSiteKey: 'YOUR_PRODUCTION_RECAPTCHA_SITE_KEY'
}
```

---

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**:
```bash
npm install -g heroku
```

2. **Login to Heroku**:
```bash
heroku login
```

3. **Create Heroku App**:
```bash
cd backend
heroku create tropicalparking-api
```

4. **Set Environment Variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=5000
heroku config:set VITE_SUPABASE_URL=https://beyxjmkkwhyoorlvmxhg.supabase.co
heroku config:set VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
heroku config:set JWT_SECRET=your_strong_secret
heroku config:set FRONTEND_URL=https://tropicalparking.com
heroku config:set STRIPE_SECRET_KEY=sk_live_your_key
# ... add all other variables
```

5. **Deploy**:
```bash
git add .
git commit -m "Prepare for production deployment"
git push heroku main
```

6. **Verify Deployment**:
```bash
heroku logs --tail
heroku open /health
```

### Option 2: Deploy to VPS (DigitalOcean, AWS, etc.)

1. **SSH into Server**:
```bash
ssh root@your-server-ip
```

2. **Install Node.js and PM2**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

3. **Clone Repository**:
```bash
cd /var/www
git clone https://github.com/Clickdzpro1/tropicalbook.git
cd tropicalbook/backend
```

4. **Install Dependencies**:
```bash
npm install --production
```

5. **Copy Environment File**:
```bash
cp .env.production .env
nano .env  # Edit with your production values
```

6. **Create Logs Directory**:
```bash
mkdir -p logs
```

7. **Start with PM2**:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

8. **Configure Nginx as Reverse Proxy**:
```nginx
server {
    listen 80;
    server_name api.tropicalparking.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

9. **Reload Nginx**:
```bash
sudo systemctl reload nginx
```

---

## Frontend Deployment

### Option 1: Deploy to Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Deploy**:
```bash
cd frontend
netlify deploy --prod --dir .
```

4. **Configure Custom Domain** in Netlify dashboard.

### Option 2: Deploy to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel --prod
```

### Option 3: Deploy to AWS S3 + CloudFront

1. **Create S3 Bucket**:
```bash
aws s3 mb s3://tropicalparking-frontend
```

2. **Enable Static Website Hosting**:
```bash
aws s3 website s3://tropicalparking-frontend --index-document index.html
```

3. **Upload Files**:
```bash
cd frontend
aws s3 sync . s3://tropicalparking-frontend --acl public-read
```

4. **Create CloudFront Distribution** for CDN and SSL.

---

## Database Setup

Your Supabase database is already configured with the migration. Verify it's ready:

1. **Login to Supabase Dashboard**: https://app.supabase.com

2. **Verify Tables Exist**:
   - users
   - locations
   - bookings
   - reviews
   - blog_posts

3. **Check Row Level Security (RLS)**:
   - All tables should have RLS enabled
   - Policies should be in place for data protection

4. **Insert Production Location Data**:
   Run the following SQL in Supabase SQL Editor:

```sql
-- Verify locations exist
SELECT * FROM locations WHERE airport_code IN ('FLL', 'YYZ');

-- If needed, locations were already inserted via migration
-- Verify sample data is present
```

5. **Create Admin User** (if needed):
```sql
-- This will be handled through the registration endpoint
-- Then manually update the role to 'admin'
```

---

## Third-Party Services

### 1. Stripe Setup

1. **Create Stripe Account**: https://stripe.com
2. **Get API Keys**: Dashboard → Developers → API Keys
3. **Set up Webhook**:
   - URL: `https://api.tropicalparking.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `payment_intent.failed`
4. **Copy Webhook Secret** and add to environment variables

### 2. Google reCAPTCHA Setup

1. **Register Site**: https://www.google.com/recaptcha/admin
2. **Choose reCAPTCHA v2** (Checkbox)
3. **Add Domains**:
   - `tropicalparking.com`
   - `www.tropicalparking.com`
4. **Copy Keys** and add to environment variables

### 3. Email Service Setup

**Option A: Gmail with App Password**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: Account → Security → App Passwords
3. Use app password in SMTP_PASS environment variable

**Option B: SendGrid**
1. Create SendGrid account
2. Generate API Key
3. Configure SMTP settings from SendGrid dashboard

---

## Domain and DNS

### 1. Configure DNS Records

Point your domain to your hosting provider:

**For Backend (api.tropicalparking.com)**:
```
Type: A
Name: api
Value: [Your server IP or load balancer IP]
TTL: 3600
```

**For Frontend (tropicalparking.com)**:
```
Type: A
Name: @
Value: [Your frontend hosting IP]
TTL: 3600

Type: CNAME
Name: www
Value: tropicalparking.com
TTL: 3600
```

### 2. Wait for DNS Propagation

Check propagation status:
```bash
dig tropicalparking.com
dig api.tropicalparking.com
```

---

## SSL/TLS Certificates

### Option 1: Let's Encrypt (Free)

Using Certbot:

1. **Install Certbot**:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain Certificate**:
```bash
sudo certbot --nginx -d tropicalparking.com -d www.tropicalparking.com
sudo certbot --nginx -d api.tropicalparking.com
```

3. **Auto-Renewal**:
```bash
sudo certbot renew --dry-run
```

### Option 2: Use Hosting Provider SSL

Most hosting providers (Netlify, Vercel, Heroku) provide automatic SSL certificates.

---

## Monitoring and Logging

### 1. Set Up Application Monitoring

**Option A: PM2 Monitoring**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

**Option B: External Services**
- Sentry (error tracking): https://sentry.io
- Datadog (APM): https://www.datadoghq.com
- New Relic (monitoring): https://newrelic.com

### 2. Set Up Uptime Monitoring

**Free Services**:
- UptimeRobot: https://uptimerobot.com
- Pingdom: https://www.pingdom.com
- StatusCake: https://www.statuscake.com

**Monitor These Endpoints**:
- `https://api.tropicalparking.com/health`
- `https://tropicalparking.com`

### 3. View Logs

**PM2 Logs**:
```bash
pm2 logs tropicalparking-api
pm2 logs tropicalparking-api --lines 100
```

**Log Files**:
```bash
tail -f /var/www/tropicalbook/backend/logs/production.log
```

---

## Post-Deployment Verification

### 1. Backend Health Check

```bash
curl https://api.tropicalparking.com/health
```

Expected response:
```json
{"status":"healthy","timestamp":"2025-11-07T..."}
```

### 2. Test API Endpoints

**Get Locations**:
```bash
curl https://api.tropicalparking.com/api/locations
```

**Search Locations**:
```bash
curl https://api.tropicalparking.com/api/locations/search?airport=FLL
```

### 3. Test Frontend

1. Visit `https://tropicalparking.com`
2. Verify page loads with animations
3. Test booking form
4. Test authentication (signup/login)
5. Check responsive design on mobile

### 4. Test End-to-End Flow

1. Register new account
2. Search for parking location
3. Create booking (test mode)
4. Process payment (Stripe test mode)
5. Verify booking confirmation
6. Check email notification

### 5. Performance Testing

**Test Page Load Speed**:
- Google PageSpeed Insights: https://pagespeed.web.dev
- GTmetrix: https://gtmetrix.com

**Test API Response Times**:
```bash
time curl https://api.tropicalparking.com/api/locations
```

### 6. Security Verification

**Check SSL Certificate**:
```bash
openssl s_client -connect tropicalparking.com:443 -servername tropicalparking.com
```

**Check Security Headers**:
```bash
curl -I https://api.tropicalparking.com/health
```

Verify headers include:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security`

---

## Troubleshooting

### Backend Not Starting

1. Check logs:
```bash
pm2 logs tropicalparking-api --err
```

2. Verify environment variables:
```bash
pm2 env 0
```

3. Check Supabase connection:
```bash
curl https://beyxjmkkwhyoorlvmxhg.supabase.co
```

### Frontend Not Connecting to Backend

1. Check browser console for CORS errors
2. Verify API URL in config.js
3. Verify CORS settings in backend allow your domain

### Database Connection Issues

1. Verify Supabase credentials
2. Check Supabase project status
3. Verify RLS policies aren't blocking requests

### SSL Certificate Issues

1. Verify DNS is pointing correctly
2. Check certificate expiration
3. Ensure certbot renewal is working

---

## Rollback Procedures

### Backend Rollback

**With PM2**:
```bash
pm2 stop tropicalparking-api
git checkout [previous-commit-hash]
npm install
pm2 restart tropicalparking-api
```

**With Heroku**:
```bash
heroku releases
heroku rollback v[previous-version]
```

### Frontend Rollback

**With Netlify**:
```bash
netlify deploy --prod --dir . --alias previous-version
```

**With Vercel**:
Use the Vercel dashboard to rollback to previous deployment

---

## Maintenance

### Regular Tasks

**Weekly**:
- Check error logs
- Monitor uptime reports
- Review performance metrics

**Monthly**:
- Update dependencies: `npm update`
- Review and rotate logs
- Check SSL certificate expiration
- Backup database (Supabase handles this automatically)

**Quarterly**:
- Security audit
- Performance optimization review
- User feedback analysis

### Backup Strategy

**Database**: Supabase provides automatic backups

**Application Code**: Stored in Git repository

**Environment Variables**: Keep secure backup of .env.production

---

## Support and Resources

### Documentation Links
- Node.js: https://nodejs.org/docs
- Express.js: https://expressjs.com
- Supabase: https://supabase.com/docs
- PM2: https://pm2.keymetrics.io/docs
- Stripe: https://stripe.com/docs

### Emergency Contacts
- Hosting Provider Support
- Supabase Support: support@supabase.io
- Stripe Support: https://support.stripe.com

### Useful Commands

**PM2 Management**:
```bash
pm2 list                    # List all processes
pm2 restart all             # Restart all apps
pm2 stop all                # Stop all apps
pm2 delete all              # Delete all apps
pm2 monit                   # Monitor in terminal
```

**Server Maintenance**:
```bash
df -h                       # Check disk space
free -h                     # Check memory usage
top                         # Check CPU usage
netstat -tulpn | grep :5000 # Check port status
```

---

## Production Checklist

Use the `PRODUCTION_CHECKLIST.md` file for a comprehensive pre-launch verification list.

---

**Deployment Guide Version**: 1.0.0
**Last Updated**: 2025-11-07
**Maintained By**: TropicalParking Development Team
