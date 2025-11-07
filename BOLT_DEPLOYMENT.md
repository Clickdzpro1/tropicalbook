# TropicalParking - Bolt (StackBlitz) Deployment Guide

## Quick Start - Deploy to Bolt in 5 Minutes

This guide will help you deploy TropicalParking to Bolt/StackBlitz for instant preview and testing.

---

## What is Bolt?

Bolt (powered by StackBlitz) is a browser-based development environment that runs Node.js applications using WebContainers. It's perfect for:
- Quick demos and prototypes
- Sharing your project with collaborators
- Testing before production deployment
- Development and experimentation

---

## Prerequisites

1. A Supabase account with your database already set up
2. Your Supabase URL and Anon Key (from project settings)
3. A browser (Chrome, Firefox, Edge, or Safari)

---

## Deployment Methods

### Method 1: Import from GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Prepare for Bolt deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tropicalparking.git
git branch -M main
git push -u origin main
```

#### Step 2: Import to Bolt

1. Go to **https://bolt.new** or **https://stackblitz.com**
2. Click **"Import from GitHub"**
3. Paste your repository URL: `https://github.com/YOUR_USERNAME/tropicalparking`
4. Click **"Import"**
5. Wait for Bolt to set up your project (1-2 minutes)

#### Step 3: Configure Environment Variables

1. Click the **gear icon** (⚙️) in Bolt
2. Go to **"Environment Variables"** or **"Settings"**
3. Add the following required variables:

```bash
VITE_SUPABASE_URL=https://beyxjmkkwhyoorlvmxhg.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
VITE_SUPABASE_SUPABASE_ANON_KEY=your_actual_anon_key_here
JWT_SECRET=generate_a_random_32_character_string
NODE_ENV=development
FRONTEND_URL=*
```

**Generate JWT Secret:**
Run this in your local terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Step 4: Start the Application

1. Bolt should auto-install dependencies
2. Click **"Run"** or the terminal will auto-start the server
3. The app will open in the Bolt preview pane
4. You should see: `🚀 Server running on port 5000`

---

### Method 2: Direct Upload to Bolt

#### Step 1: Prepare Your Files

Make sure your project structure looks like this:

```
tropicalparking/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── config.js
├── supabase/
│   └── migrations/
├── package.json (root)
├── .env.example
└── BOLT_DEPLOYMENT.md
```

#### Step 2: Create New Bolt Project

1. Go to **https://bolt.new**
2. Click **"New Project"**
3. Select **"Node.js"** as the template
4. Name it "TropicalParking"

#### Step 3: Upload Files

1. Use the file explorer in Bolt to upload your project files
2. You can drag and drop entire folders
3. Or use the upload button to select files

**Alternative: Use StackBlitz Upload Feature**
1. Zip your entire project folder
2. Go to https://stackblitz.com
3. Click "Import Project"
4. Upload your ZIP file

#### Step 4: Configure and Run

Same as Method 1, Steps 3-4 above.

---

## Verifying Your Deployment

### 1. Check Server Status

In the Bolt terminal, you should see:
```
🚀 Server running on port 5000
📁 Serving frontend from: /home/projects/tropicalparking/frontend
🌍 Environment: development
✅ Supabase Connected
```

### 2. Test the Application

1. **Homepage**: Should load with animations and tropical theme
2. **Locations Section**: Scroll down to see parking locations
3. **Browser Console**: Should see `🌴 TropicalParking running in bolt mode`

### 3. Test API Endpoints

Open the browser console (F12) and run:

```javascript
// Test health endpoint
fetch('/health').then(r => r.json()).then(console.log);

// Test locations API
fetch('/api/locations').then(r => r.json()).then(console.log);

// Test search
fetch('/api/locations/search?airport=FLL').then(r => r.json()).then(console.log);
```

### 4. Test Supabase Connection

```javascript
// This should return locations from your database
fetch('/api/locations')
  .then(r => r.json())
  .then(data => console.log('Locations:', data));
```

---

## Features Available in Bolt

### ✅ Working Features

- Frontend interface with animations
- Location search and display
- API endpoints
- Supabase database connection
- Authentication (signup/login)
- Booking form (UI only)
- Review system
- Blog display
- Responsive design

### ⚠️ Limited Features

- **Stripe Payments**: Test mode only (no real transactions)
- **Email Notifications**: May not work (no SMTP in WebContainer)
- **File Uploads**: Limited to temporary storage
- **Session Persistence**: Temporary (resets on refresh)

### ❌ Not Available

- Production payment processing
- Email sending (nodemailer)
- Persistent file uploads
- Background cron jobs
- Long-running processes

---

## Troubleshooting

### Issue: "Cannot connect to Supabase"

**Solution:**
1. Verify your Supabase URL and keys are correct
2. Check that environment variables are set in Bolt
3. Ensure your Supabase project is active
4. Check browser console for specific errors

**Test in console:**
```javascript
console.log(process.env.VITE_SUPABASE_URL);
```

### Issue: "Server not starting"

**Solution:**
1. Check the Bolt terminal for error messages
2. Verify all dependencies installed: look for "Installing dependencies..." message
3. Check that package.json is in the root directory
4. Try clicking "Restart" in Bolt terminal

### Issue: "Frontend shows but API calls fail"

**Solution:**
1. Check browser console for CORS errors
2. Verify API calls are using relative URLs (`/api/...`)
3. Check that backend server is running (look for port 5000 message)
4. Test endpoints directly: `fetch('/health')`

### Issue: "Blank page or 404 error"

**Solution:**
1. Check that index.html exists in frontend folder
2. Verify server.js has static file serving configured
3. Check browser console for JavaScript errors
4. Clear browser cache and refresh

### Issue: "Environment variables not loading"

**Solution:**
1. Restart the Bolt project after adding env vars
2. Verify variable names match exactly (case-sensitive)
3. Check for typos in variable names
4. Use Bolt's built-in environment variable manager

---

## Sharing Your Bolt Deployment

### Get Share Link

1. Click the **"Share"** button in Bolt
2. Choose **"Public"** to allow anyone to view
3. Copy the generated URL (e.g., `https://stackblitz.com/edit/tropicalparking-xyz`)
4. Share this link with collaborators or stakeholders

### Embedding in Websites

Bolt provides embed codes:
1. Click "Share"
2. Select "Embed"
3. Copy the iframe code
4. Paste into your website or documentation

---

## Performance Tips

### Optimize for Bolt

1. **Minimize Dependencies**: Remove unused npm packages
2. **Lazy Load Assets**: Don't load all features at once
3. **Use CDN Links**: For libraries like GSAP, use CDN instead of npm
4. **Simplify Database Queries**: Limit result sets to reduce load
5. **Cache Static Assets**: Let Express handle caching

### Speed Up Loading

1. Keep package.json minimal
2. Use `.boltignore` to exclude unnecessary files:
```
node_modules/
logs/
*.log
.git/
backend/.env.production
DEPLOYMENT.md
```

---

## Limitations to Keep in Mind

### Technical Limitations

1. **No Real File System**: Files are stored in memory
2. **Limited CPU/Memory**: WebContainer has resource constraints
3. **Network Restrictions**: Some outbound connections may be blocked
4. **No Background Jobs**: Cron jobs won't run persistently
5. **Session Resets**: Application state resets on page refresh

### Development vs Production

Bolt is ideal for:
- ✅ Development and testing
- ✅ Demos and presentations
- ✅ Code sharing and collaboration
- ✅ Prototyping features

NOT recommended for:
- ❌ Production applications
- ❌ Real user data
- ❌ Payment processing
- ❌ High-traffic applications

---

## Next Steps After Bolt

Once you've tested in Bolt, deploy to production:

### Recommended Production Setup

1. **Backend**: Deploy to Heroku, Railway, or Render
2. **Frontend**: Deploy to Netlify or Vercel
3. **Database**: Keep using Supabase (already configured)
4. **Payments**: Enable Stripe live mode
5. **Email**: Configure production SMTP service
6. **Monitoring**: Add Sentry or LogRocket

See **DEPLOYMENT.md** for complete production deployment instructions.

---

## Environment-Specific Configuration

The application automatically detects when it's running in Bolt and adjusts:

### Automatic Detection

```javascript
// In frontend/config.js
function detectEnvironment() {
  const hostname = window.location.hostname;

  if (hostname.includes('bolt.new') ||
      hostname.includes('stackblitz.io')) {
    return 'bolt'; // Uses /api for API calls
  }

  return 'development'; // Uses http://localhost:5000/api
}
```

### What Changes in Bolt Mode

- API URL becomes relative (`/api` instead of full URL)
- CORS allows all origins
- Helmet security relaxed for development
- Logging is more verbose
- Error messages are detailed

---

## Security Notes for Bolt

### Safe to Use

- Supabase Anon Key (designed to be public)
- JWT Secret (temporary, for demo only)
- Test Stripe keys (starts with `pk_test_` or `sk_test_`)

### Never Use in Bolt

- Production Stripe keys (`pk_live_`, `sk_live_`)
- Real email credentials
- Production database credentials
- Any sensitive API keys
- Real user data

### Public Access

Remember: Bolt projects can be public, so:
- Never commit sensitive credentials
- Use test keys only
- Don't store real user data
- Assume anyone can see your code

---

## Getting Help

### Bolt Documentation
- StackBlitz Docs: https://developer.stackblitz.com
- WebContainers: https://webcontainers.io

### TropicalParking Resources
- Main README: `README.md`
- Production Guide: `DEPLOYMENT.md`
- Quick Start: `QUICK_START.md`

### Common Issues
- Check Bolt Console (F12 in browser)
- Check Bolt Terminal for server errors
- Review environment variables setup
- Verify Supabase connection

---

## Summary

### Quick Deployment Checklist

- [ ] Push code to GitHub OR prepare ZIP file
- [ ] Go to https://bolt.new
- [ ] Import project from GitHub or upload files
- [ ] Add environment variables (especially Supabase credentials)
- [ ] Wait for dependencies to install
- [ ] Verify server starts successfully
- [ ] Test frontend loads correctly
- [ ] Test API endpoints work
- [ ] Share your preview link

### Expected Result

A fully functional TropicalParking demo running in your browser with:
- Beautiful frontend with animations
- Working location search
- Functional booking form UI
- User authentication
- Connected to your Supabase database
- Shareable preview URL

---

**Ready to deploy?** Go to [bolt.new](https://bolt.new) and get started! 🚀

**Need production deployment?** See `DEPLOYMENT.md` for full hosting options.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Compatibility**: Bolt/StackBlitz WebContainers
