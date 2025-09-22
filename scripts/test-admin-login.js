// Test admin login with real database

async function testAdminLogin() {
  console.log('🔐 Testing Admin Login...\n');

  const loginData = {
    email: 'admin@pennkraft.com',
    password: 'admin123'
  };

  try {
    console.log('📧 Email:', loginData.email);
    console.log('🔑 Password:', loginData.password);
    console.log('\n📡 Sending login request to http://localhost:3001/api/admin/login...\n');

    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Login successful!\n');
      console.log('👤 Admin Details:');
      console.log('   - ID:', data.admin.id);
      console.log('   - Name:', data.admin.name);
      console.log('   - Email:', data.admin.email);
      console.log('   - Role:', data.admin.role);
      console.log('   - Token:', data.token ? '***' + data.token.slice(-10) : 'None');
      console.log('\n🎉 Admin authentication is working with the database!');

      // Test navigation instructions
      console.log('\n📝 Next Steps:');
      console.log('1. Open browser to: http://localhost:3001/admin/login');
      console.log('2. Enter credentials:');
      console.log('   Email: admin@pennkraft.com');
      console.log('   Password: admin123');
      console.log('3. You should be redirected to the admin dashboard');
    } else {
      console.error('❌ Login failed:', data.error);
      console.log('\nPlease check:');
      console.log('1. Database is running');
      console.log('2. Admin user exists in database');
      console.log('3. Password is correct');
    }
  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Next.js server is running (npm run dev)');
    console.log('2. Server is on port 3001');
  }
}

testAdminLogin();