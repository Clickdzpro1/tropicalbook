#!/usr/bin/env node

console.log('\n🔍 TropicalParking Deployment Verification\n');

const checks = {
  passed: [],
  failed: [],
  warnings: []
};

function checkPass(name) {
  checks.passed.push(name);
  console.log(`✅ ${name}`);
}

function checkFail(name, reason) {
  checks.failed.push({ name, reason });
  console.log(`❌ ${name}: ${reason}`);
}

function checkWarn(name, reason) {
  checks.warnings.push({ name, reason });
  console.log(`⚠️  ${name}: ${reason}`);
}

const fs = require('fs');
const path = require('path');

console.log('📦 Checking Project Structure...\n');

const requiredFiles = [
  'package.json',
  'backend/server.js',
  'frontend/index.html',
  'frontend/app.js',
  'frontend/style.css',
  'frontend/config.js',
  '.env.example',
  'BOLT_DEPLOYMENT.md'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    checkPass(`File exists: ${file}`);
  } else {
    checkFail(`File missing: ${file}`, 'Required file not found');
  }
});

console.log('\n🔐 Checking Environment Configuration...\n');

if (fs.existsSync('.env')) {
  const env = fs.readFileSync('.env', 'utf-8');

  if (env.includes('VITE_SUPABASE_URL')) {
    checkPass('Supabase URL configured');
  } else {
    checkFail('Supabase URL missing', 'Add VITE_SUPABASE_URL to .env');
  }

  if (env.includes('VITE_SUPABASE_ANON_KEY')) {
    checkPass('Supabase Anon Key configured');
  } else {
    checkFail('Supabase Anon Key missing', 'Add VITE_SUPABASE_ANON_KEY to .env');
  }

  if (env.includes('JWT_SECRET')) {
    checkPass('JWT Secret configured');
  } else {
    checkWarn('JWT Secret missing', 'Generate one for security');
  }
} else {
  checkWarn('.env file not found', 'Copy from .env.example and configure');
}

console.log('\n📋 Checking Package Configuration...\n');

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

  if (pkg.scripts && pkg.scripts.start) {
    checkPass('Start script configured');
  } else {
    checkFail('Start script missing', 'Add "start" script to package.json');
  }

  if (pkg.dependencies && pkg.dependencies['@supabase/supabase-js']) {
    checkPass('Supabase client installed');
  } else {
    checkFail('Supabase client missing', 'Run npm install @supabase/supabase-js');
  }

  if (pkg.dependencies && pkg.dependencies.express) {
    checkPass('Express installed');
  } else {
    checkFail('Express missing', 'Run npm install express');
  }
} catch (err) {
  checkFail('Package.json parse error', err.message);
}

console.log('\n🗄️  Checking Database Configuration...\n');

try {
  const supabaseConfig = fs.readFileSync('backend/config/supabase.js', 'utf-8');

  if (supabaseConfig.includes('VITE_SUPABASE_URL') &&
      supabaseConfig.includes('VITE_SUPABASE_ANON_KEY')) {
    checkPass('Supabase config uses environment variables');
  } else {
    checkFail('Supabase config issue', 'Check environment variable usage');
  }

  if (supabaseConfig.includes('createClient')) {
    checkPass('Supabase client initialized');
  } else {
    checkFail('Supabase client missing', 'Check supabase.js configuration');
  }
} catch (err) {
  checkFail('Supabase config error', err.message);
}

console.log('\n🌐 Checking Frontend Configuration...\n');

try {
  const frontendConfig = fs.readFileSync('frontend/config.js', 'utf-8');

  if (frontendConfig.includes('bolt') && frontendConfig.includes('stackblitz')) {
    checkPass('Bolt environment detection configured');
  } else {
    checkWarn('Bolt detection missing', 'May not auto-detect Bolt environment');
  }

  if (frontendConfig.includes('/api')) {
    checkPass('API URL configuration found');
  } else {
    checkFail('API URL missing', 'Check config.js API settings');
  }
} catch (err) {
  checkFail('Frontend config error', err.message);
}

console.log('\n🖥️  Checking Backend Configuration...\n');

try {
  const serverCode = fs.readFileSync('backend/server.js', 'utf-8');

  if (serverCode.includes('express.static')) {
    checkPass('Static file serving configured');
  } else {
    checkFail('Static serving missing', 'Backend needs to serve frontend files');
  }

  if (serverCode.includes('/api/')) {
    checkPass('API routes configured');
  } else {
    checkFail('API routes missing', 'Check route configuration');
  }

  if (serverCode.includes('cors')) {
    checkPass('CORS configured');
  } else {
    checkWarn('CORS missing', 'May have issues in production');
  }
} catch (err) {
  checkFail('Backend config error', err.message);
}

console.log('\n📊 Verification Summary\n');
console.log(`✅ Passed: ${checks.passed.length}`);
console.log(`⚠️  Warnings: ${checks.warnings.length}`);
console.log(`❌ Failed: ${checks.failed.length}`);

if (checks.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  checks.warnings.forEach(w => console.log(`   - ${w.name}: ${w.reason}`));
}

if (checks.failed.length > 0) {
  console.log('\n❌ Failed Checks:');
  checks.failed.forEach(f => console.log(`   - ${f.name}: ${f.reason}`));
  console.log('\n❌ Deployment verification FAILED. Fix the issues above.\n');
  process.exit(1);
} else {
  console.log('\n✅ All critical checks passed!');
  console.log('\n🚀 Ready for Bolt Deployment!');
  console.log('\nNext steps:');
  console.log('1. Push to GitHub or prepare files for upload');
  console.log('2. Go to https://bolt.new');
  console.log('3. Import your project');
  console.log('4. Configure environment variables in Bolt');
  console.log('5. Start the application!\n');
  console.log('📖 See BOLT_DEPLOYMENT.md for detailed instructions\n');
  process.exit(0);
}
