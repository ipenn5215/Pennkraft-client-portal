#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests PostgreSQL connection for production deployment
 */

const { Client } = require('pg');
require('dotenv').config({ path: '.env.production' });

async function testConnection() {
  console.log('🔍 Testing PostgreSQL Database Connection...\n');

  const connectionString = process.env.DATABASE_URL ||
    'postgresql://inmoti87_pennkraft:your_password@localhost:5432/inmoti87_portal?schema=public';

  // Parse and display connection details (without password)
  const url = new URL(connectionString);
  console.log('📋 Connection Details:');
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port}`);
  console.log(`   Database: ${url.pathname.slice(1).split('?')[0]}`);
  console.log(`   User: ${url.username}`);
  console.log(`   SSL: ${url.searchParams.get('sslmode') || 'not specified'}\n`);

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('🔄 Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to PostgreSQL!\n');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 Database Version:');
    console.log(`   ${result.rows[0].version}\n`);

    // Check if we can create tables (test permissions)
    console.log('🔐 Testing permissions...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_connection (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ CREATE TABLE permission: OK');

    // Clean up test table
    await client.query('DROP TABLE IF EXISTS test_connection');
    console.log('✅ DROP TABLE permission: OK\n');

    console.log('🎉 Database connection test PASSED!');
    console.log('   Your PostgreSQL database is ready for Prisma migrations.\n');

  } catch (error) {
    console.error('❌ Connection test FAILED!\n');
    console.error('Error details:', error.message);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Possible issues:');
      console.log('   1. PostgreSQL service is not running');
      console.log('   2. Incorrect host or port');
      console.log('   3. Firewall blocking connection');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed:');
      console.log('   1. Check username and password');
      console.log('   2. Verify user exists in PostgreSQL');
      console.log('   3. Check user permissions');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist:');
      console.log('   1. Create the database in cPanel');
      console.log('   2. Check database name spelling');
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the test
testConnection().catch(console.error);