# 🌴 TropicalParking V3 - Complete Full-Stack Application

**Premium Airport Parking Management System** for Fort Lauderdale (FLL) & Toronto Pearson (YYZ)

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://tropicalparking.com)
[![Version](https://img.shields.io/badge/version-3.0.0-blue)]
[![License](https://img.shields.io/badge/license-MIT-orange)]

## 🚀 Features

### Frontend
- ✨ **Modern Animations** with GSAP, parallax effects, and CSS keyframes
- 🎨 **Beautiful UI** with tropical theme and smooth transitions
- 🔐 **Enhanced Authentication** with reCAPTCHA (no email confirmation)
- 📱 **Responsive Design** - Mobile-first approach
- 💳 **Payment Integration** - Stripe checkout
- ⭐ **Real Customer Reviews** from Google & Yelp
- 📝 **SEO-Optimized Blog** for daily content

### Backend (Node.js + Express + MongoDB)
- 🏗️ **RESTful API** with Express.js 4.18+
- 🗄️ **MongoDB** database with Mongoose ODM
- 🔒 **JWT Authentication** with refresh tokens
- 🛡️ **Security**: Helmet, Rate Limiting, CORS, Sanitization
- 📧 **Email Service** with Nodemailer
- 💰 **Payment Processing** via Stripe
- 📊 **Analytics Dashboard**
- 💬 **Real-time Chat** with Socket.IO

### Admin Dashboard
- 📈 Real-time Analytics & Revenue Reports
- 👥 User Management System
- 🚗 Booking Management with Filters
- 📍 Location & Availability Tracking
- 💳 Payment & Refund Processing
- ⭐ Review Moderation
- 📝 Blog CMS with Rich Editor
- 🎫 Promo Code Generator
- 🔍 Comprehensive Audit Logs

### Customer Dashboard
- 📅 Booking History with Receipts
- 🎁 Loyalty Points (Bronze/Silver/Gold tiers)
- ⭐ Review Management
- 🔔 Notifications Center
- 👤 Profile & Vehicle Management
- 💳 Saved Payment Methods

## 🏆 Real Customer Reviews

⭐⭐⭐⭐⭐ *"Staff was amazing. Drivers were so nice. Highly recommend!"* - Tammy C.

⭐⭐⭐⭐⭐ *"Great value and great service."* - David D.

⭐⭐⭐⭐⭐ *"Quick and convenient. Helped make our trip care free."* - Sean A.

## 📁 Project Structure

```
tropicalbook/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── assets/
│
├── .gitignore
└── README.md
```

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, JavaScript ES6+, GSAP, Parallax.js

**Backend:** Node.js 18+, Express.js, MongoDB, Mongoose, JWT

**Security:** Helmet, CORS, Rate Limiting, bcryptjs

**Payments:** Stripe API

**Email:** Nodemailer

**Real-time:** Socket.IO

## 🚀 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- Stripe account
- Google reCAPTCHA keys

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Clickdzpro1/tropicalbook.git
cd tropicalbook/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start MongoDB
mongod

# Run server
npm run dev
```

### Frontend Setup

```bash
cd ../frontend

# Use any static file server
npx http-server -p 3000
# Or use Live Server in VS Code
```

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
```

### Locations
```
GET    /api/locations
GET    /api/locations/:id
GET    /api/locations/search
GET    /api/locations/availability
```

### Bookings
```
POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id
DELETE /api/bookings/:id
```

### Reviews
```
POST   /api/reviews
GET    /api/reviews/:locationId
PUT    /api/reviews/:id
POST   /api/reviews/:id/helpful
```

### Admin
```
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/analytics
GET    /api/admin/revenue
POST   /api/admin/promo-codes
GET    /api/admin/audit-logs
```

### Blog
```
GET    /api/blog/posts
GET    /api/blog/posts/:slug
POST   /api/blog/posts (admin)
PUT    /api/blog/posts/:id (admin)
```

## 🎨 Animation Features

- **GSAP** timeline-based animations
- **Parallax** scrolling effects
- **CSS** keyframes and transitions
- **Scroll-triggered** reveals
- **Micro-interactions** on hover
- **Loading** skeleton screens

## 🔐 Security

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests/15min)
- Input validation & sanitization
- MongoDB injection protection
- XSS protection with Helmet
- CORS configuration
- SSL/TLS encryption

## 📱 Responsive Design

- Mobile breakpoint: 768px
- Tablet breakpoint: 1024px
- Desktop optimized: 1440px+
- Touch-friendly interfaces
- Hamburger menu for mobile

## 📝 SEO Optimization

- Semantic HTML5 markup
- Meta tags optimization
- Open Graph & Twitter Cards
- XML Sitemap
- Schema.org markup
- Daily blog posts
- Image optimization
- Fast loading speeds

## 🧪 Testing

```bash
npm test
npm run test:coverage
```

## 🚀 Deployment

### Backend (PM2)
```bash
npm install -g pm2
pm2 start server.js --name tropicalparking
pm2 save
pm2 startup
```

### Frontend
Deploy to Netlify, Vercel, or AWS S3 + CloudFront

## 🎯 Demo Accounts

**Customer Account:**
- Email: customer@tropical.com
- Password: password123

**Admin Account:**
- Email: admin@tropical.com
- Password: admin123

## 📞 Support

- **Email:** support@tropicalparking.com
- **Phone:** (954) 555-0100
- **Live Chat:** Available on website

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- **Development Team** - TropicalParking
- **Design** - Modern UI/UX Team

## 🔄 Changelog

### Version 3.0.0 (2025-11-07)
- ✨ Complete rewrite with modern stack
- 🎨 Added GSAP animations & parallax
- 🔐 Enhanced authentication with reCAPTCHA
- 📊 Full admin dashboard
- 👤 Enhanced customer dashboard
- 📝 SEO blog system
- 💬 Real-time chat
- 🎁 Loyalty program
- 💳 Stripe integration
- 📱 Mobile-first design
- ⭐ Real customer reviews
- 🤖 Automated blog posts

---

**Built with ❤️ by TropicalParking Team** | © 2025 All Rights Reserved

[View Live Demo](https://tropicalparking.com) | [Report Bug](https://github.com/Clickdzpro1/tropicalbook/issues) | [Request Feature](https://github.com/Clickdzpro1/tropicalbook/issues)