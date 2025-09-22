#!/usr/bin/env node

/**
 * cPanel Node.js Application Starter
 * This file is used by cPanel to start the Next.js application
 */

const { spawn } = require('child_process');
const path = require('path');

// Set production environment
process.env.NODE_ENV = 'production';

// Get the port from cPanel (it's dynamically assigned)
const PORT = process.env.PORT || 3000;

console.log(`Starting Pennkraft Portal on port ${PORT}...`);

// Start the Next.js application
const nextApp = spawn('npm', ['start'], {
  cwd: __dirname,
  env: {
    ...process.env,
    PORT: PORT,
    NODE_ENV: 'production'
  },
  stdio: 'inherit'
});

nextApp.on('error', (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

nextApp.on('exit', (code) => {
  console.log(`Application exited with code ${code}`);
  process.exit(code);
});