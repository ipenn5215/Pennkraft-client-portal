const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Since we don't have the anon key yet, we'll need to get it from Supabase dashboard
// For now, let's create a script that can be run once the key is added

console.log('🚀 Database Setup Script')
console.log('========================')
console.log('')
console.log('⚠️  Before running this script, you need to:')
console.log('')
console.log('1. Go to: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/settings/api')
console.log('2. Copy your "anon public" key')
console.log('3. Add it to .env.local as NEXT_PUBLIC_SUPABASE_ANON_KEY')
console.log('')
console.log('📝 Your .env.local file should look like:')
console.log('--------------------------------------------')
console.log('NEXT_PUBLIC_SUPABASE_URL=https://sgsjafwcqclqcryjpfcy.supabase.co')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here')
console.log('DATABASE_URL=postgresql://postgres:blg3gyyLrNqmbNtC@db.sgsjafwcqclqcryjpfcy.supabase.co:5432/postgres')
console.log('--------------------------------------------')
console.log('')
console.log('Once you have added the key, you can run the migrations manually in the Supabase SQL editor:')
console.log('https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/editor')
console.log('')
console.log('Migration files are located at:')
console.log('- supabase/migrations/001_initial_schema.sql')
console.log('- supabase/seed.sql')
console.log('')

// Export the SQL files for easy copying
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '001_initial_schema.sql')
const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql')

if (fs.existsSync(migrationPath) && fs.existsSync(seedPath)) {
  console.log('✅ SQL files found and ready to use!')
  console.log('')
  console.log('Instructions:')
  console.log('1. Copy the contents of 001_initial_schema.sql')
  console.log('2. Paste and run in the Supabase SQL editor')
  console.log('3. Copy the contents of seed.sql')
  console.log('4. Paste and run in the Supabase SQL editor')
} else {
  console.log('❌ SQL files not found!')
}