// TropicalParking Frontend Configuration
// Environment-based API URL configuration

const ENV = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    stripePublicKey: 'pk_test_YOUR_STRIPE_TEST_KEY',
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY'
  },
  production: {
    apiUrl: 'https://api.tropicalparking.com/api',
    stripePublicKey: 'pk_live_YOUR_STRIPE_PRODUCTION_KEY',
    recaptchaSiteKey: 'YOUR_PRODUCTION_RECAPTCHA_SITE_KEY'
  }
};

const isProduction = window.location.hostname !== 'localhost' &&
                     window.location.hostname !== '127.0.0.1';

const config = isProduction ? ENV.production : ENV.development;

window.TROPICAL_CONFIG = config;
