const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

// Extract connection details from DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL
const urlParts = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
const [, user, password, host, port, database] = urlParts

// Create Supabase client with service role for admin operations
const supabaseUrl = `https://${host.replace('db.', '').replace('.supabase.co', '')}.supabase.co`
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🚀 Starting database setup...')
console.log(`📦 Connecting to Supabase project: ${host.split('.')[1]}`)

// For this script, we'll use pg directly for better control
const { Client } = require('pg')

async function setupDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {
    await client.connect()
    console.log('✅ Connected to database')

    // Read and execute migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
    const migration = fs.readFileSync(migrationPath, 'utf8')

    console.log('📝 Running migrations...')

    // Split by semicolons and execute each statement
    const statements = migration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      try {
        await client.query(statement)
        process.stdout.write('.')
      } catch (error) {
        if (error.message.includes('already exists')) {
          process.stdout.write('○')
        } else {
          console.error(`\n❌ Error executing statement ${i + 1}:`, error.message)
          console.error('Statement:', statement.substring(0, 100) + '...')
        }
      }
    }
    console.log('\n✅ Migrations completed')

    // Read and execute seed file
    const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql')
    const seed = fs.readFileSync(seedPath, 'utf8')

    console.log('🌱 Seeding database...')

    // First, clear existing data to avoid duplicates
    await client.query('DELETE FROM public.tools WHERE TRUE;')
    await client.query('DELETE FROM public.contact_submissions WHERE TRUE;')

    // Split seed file and execute
    const seedStatements = seed
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    for (let i = 0; i < seedStatements.length; i++) {
      const statement = seedStatements[i] + ';'
      try {
        await client.query(statement)
        process.stdout.write('.')
      } catch (error) {
        console.error(`\n⚠️ Error seeding data ${i + 1}:`, error.message)
      }
    }
    console.log('\n✅ Database seeded successfully')

    // Verify the setup
    const toolsResult = await client.query('SELECT COUNT(*) FROM public.tools')
    const contactsResult = await client.query('SELECT COUNT(*) FROM public.contact_submissions')

    console.log('\n📊 Database Statistics:')
    console.log(`   - Tools in marketplace: ${toolsResult.rows[0].count}`)
    console.log(`   - Contact submissions: ${contactsResult.rows[0].count}`)

    console.log('\n🎉 Database setup completed successfully!')
    console.log('\n⚠️  Important: You need to add your Supabase ANON key to .env.local')
    console.log('   Get it from: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/settings/api')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Install pg if not already installed
const { exec } = require('child_process')

console.log('📦 Checking for pg package...')
exec('npm list pg', (error) => {
  if (error) {
    console.log('📦 Installing pg package...')
    exec('npm install pg', (installError) => {
      if (installError) {
        console.error('❌ Failed to install pg:', installError)
        process.exit(1)
      }
      console.log('✅ pg package installed')
      setupDatabase()
    })
  } else {
    setupDatabase()
  }
})