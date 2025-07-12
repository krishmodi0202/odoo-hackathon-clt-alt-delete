const fs = require('fs');
const path = require('path');

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ohrmkrbzjkowqvsybfkb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocm1rcmJ6amtvd3F2c3liZmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTQxNTYsImV4cCI6MjA2Nzg3MDE1Nn0.LIVLf2PofVDnn7fwLWLBr3S0jBI0e5hBJARHgqCCRKk

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!');
  console.log('📍 Location:', envPath);
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('\n📝 Please create .env.local manually with the following content:');
  console.log(envContent);
} 