#!/usr/bin/env node

/**
 * Simple Production Test
 * Run this on the server after deployment to verify everything works
 */

console.log('🔍 Production Environment Test\n');

// Check environment variables
console.log('📋 Environment Variables:');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('   NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'NOT SET');
console.log('   NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ NOT SET');
console.log('   PORT:', process.env.PORT || 'NOT SET');

// Check if we can import Next.js
try {
  const packageJson = require('./package.json');
  console.log('\n📦 Package Info:');
  console.log('   Name:', packageJson.name);
  console.log('   Version:', packageJson.version);
  console.log('   Next.js:', packageJson.dependencies.next);
} catch (error) {
  console.error('\n❌ Could not read package.json');
}

// Check if build exists
const fs = require('fs');
const path = require('path');

console.log('\n🏗️  Build Status:');
if (fs.existsSync(path.join(__dirname, '.next'))) {
  console.log('   ✅ .next directory exists');

  // Check for key build files
  const buildFiles = [
    '.next/BUILD_ID',
    '.next/build-manifest.json',
    '.next/app-build-manifest.json'
  ];

  buildFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  });
} else {
  console.log('   ❌ .next directory NOT found - run "npm run build"');
}

// Test database connection if in production
if (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL) {
  console.log('\n🗄️  Testing Database Connection...');
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  client.connect()
    .then(() => {
      console.log('   ✅ Database connection successful!');
      return client.query('SELECT NOW()');
    })
    .then(result => {
      console.log('   Database time:', result.rows[0].now);
      return client.end();
    })
    .catch(error => {
      console.error('   ❌ Database connection failed:', error.message);
    });
} else {
  console.log('\n⚠️  Skipping database test (not in production or DATABASE_URL not set)');
}

console.log('\n✨ Test complete!');