// TropicalParking Frontend Configuration
// Environment-based API URL configuration

const ENV = {
  development: {
    apiUrl: 'http://localhost:5000/api',
    stripePublicKey: 'pk_test_YOUR_STRIPE_TEST_KEY',
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY'
  },
  bolt: {
    apiUrl: '/api',
    stripePublicKey: 'pk_test_YOUR_STRIPE_TEST_KEY',
    recaptchaSiteKey: 'YOUR_RECAPTCHA_SITE_KEY'
  },
  production: {
    apiUrl: 'https://api.tropicalparking.com/api',
    stripePublicKey: 'pk_live_YOUR_STRIPE_PRODUCTION_KEY',
    recaptchaSiteKey: 'YOUR_PRODUCTION_RECAPTCHA_SITE_KEY'
  }
};

function detectEnvironment() {
  const hostname = window.location.hostname;

  if (hostname.includes('bolt.new') ||
      hostname.includes('stackblitz.io') ||
      hostname.includes('webcontainer')) {
    return 'bolt';
  }

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }

  return 'production';
}

const environment = detectEnvironment();
const config = ENV[environment];

console.log(`🌴 TropicalParking running in ${environment} mode`);
console.log(`🔗 API URL: ${config.apiUrl}`);

window.TROPICAL_CONFIG = config;
