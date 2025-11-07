# TropicalParking V3 - Quick Start Guide

## 🚀 Deploy Your Application in 3 Steps

This guide will get your TropicalParking application deployed to production quickly.

---

## Step 1: Configure Environment Variables

### Backend Configuration

1. **Copy the production environment template**:
```bash
cd backend
cp .env.production .env
```

2. **Update the following critical values** in `.env`:

```bash
# Generate a strong secret (run this command):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Then paste the output here:
JWT_SECRET=paste_generated_secret_here

# Your production domain:
FRONTEND_URL=https://tropicalparking.com

# Get from Stripe Dashboard → Developers → API Keys:
STRIPE_SECRET_KEY=sk_live_your_stripe_production_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your email service (Gmail example):
SMTP_USER=support@tropicalparking.com
SMTP_PASS=your_gmail_app_password

# Get from Google reCAPTCHA Admin:
RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key
```

### Frontend Configuration

1. **Edit** `frontend/config.js`:

```javascript
production: {
  apiUrl: 'https://api.tropicalparking.com/api',
  stripePublicKey: 'pk_live_your_stripe_public_key',
  recaptchaSiteKey: 'your_recaptcha_site_key'
}
```

---

## Step 2: Deploy Backend

### Option A: Deploy to Heroku (Easiest)

```bash
cd backend

# Login to Heroku
heroku login

# Create app
heroku create tropicalparking-api

# Set all environment variables from your .env file
# (Replace values with your actual credentials)
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set FRONTEND_URL=https://tropicalparking.com
# ... set all other variables

# Deploy
git add .
git commit -m "Ready for production"
git push heroku main

# Verify
heroku open /health
```

### Option B: Deploy to Your VPS

```bash
cd backend

# Make deployment script executable (if not already)
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Choose option 2 for Production
# Follow the prompts
```

**Manual VPS Setup**:
```bash
# SSH into your server
ssh root@your-server-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Clone and setup
cd /var/www
git clone [your-repo-url]
cd tropicalbook/backend
npm install --production

# Configure environment
cp .env.production .env
nano .env  # Edit with your values

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## Step 3: Deploy Frontend

### Option A: Deploy to Netlify (Recommended)

```bash
cd frontend

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir .

# Configure custom domain in Netlify dashboard
```

### Option B: Deploy to Vercel

```bash
cd frontend

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Follow prompts to configure domain
```

### Option C: Use Deployment Script

```bash
cd frontend
chmod +x deploy.sh
./deploy.sh

# Choose your preferred deployment target
```

---

## Verification

### 1. Test Backend

```bash
# Health check
curl https://api.tropicalparking.com/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":123.45}

# Test locations API
curl https://api.tropicalparking.com/api/locations
```

### 2. Test Frontend

1. Visit https://tropicalparking.com
2. Verify page loads with animations
3. Test booking form
4. Try to register/login
5. Check mobile responsiveness

---

## Common Issues

### Backend won't start
```bash
# Check logs
pm2 logs tropicalparking-api

# Common fixes:
# - Verify .env file exists and has all values
# - Check Supabase credentials
# - Ensure port 5000 is available
```

### Frontend can't connect to backend
- Verify CORS settings in backend allow your frontend domain
- Check API URL in frontend/config.js
- Ensure backend is running and accessible

### Database errors
- Verify Supabase project is active
- Check credentials in .env
- Ensure RLS policies are correct

---

## Next Steps

1. ✅ **Configure DNS**: Point your domain to hosting providers
2. ✅ **SSL Certificates**: Enable HTTPS (automatic with Netlify/Vercel/Heroku)
3. ✅ **Set up monitoring**: Use UptimeRobot or similar
4. ✅ **Test everything**: Use the PRODUCTION_CHECKLIST.md
5. ✅ **Go live!**: Announce your launch

---

## Important Files

- **DEPLOYMENT.md** - Complete deployment guide with all hosting options
- **PRODUCTION_CHECKLIST.md** - Comprehensive checklist before going live
- **backend/.env.production** - Production environment template
- **backend/ecosystem.config.js** - PM2 process configuration
- **backend/deploy.sh** - Automated backend deployment script
- **frontend/deploy.sh** - Automated frontend deployment script
- **frontend/config.js** - Frontend environment configuration

---

## Support

Need help? Check these resources:

- **Full Documentation**: See DEPLOYMENT.md
- **Checklist**: See PRODUCTION_CHECKLIST.md
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **PM2 Docs**: https://pm2.keymetrics.io/docs

---

## Emergency Rollback

If something goes wrong:

**Backend**:
```bash
pm2 stop tropicalparking-api
git checkout [previous-commit]
pm2 restart tropicalparking-api
```

**Frontend**:
Use your hosting provider's dashboard to rollback to previous deployment.

---

**Ready to Deploy?** Start with Step 1! 🚀
