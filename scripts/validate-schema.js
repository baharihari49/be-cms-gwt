// scripts/validate-schema.js
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Validating Prisma schema...');
console.log('📊 DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');

// Debug environment
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  const masked = dbUrl.replace(/\/\/.*:.*@/, '//***:***@');
  console.log('🔗 Database URL (masked):', masked);
} else {
  console.error('❌ DATABASE_URL not found in environment');
  console.log('💡 Make sure .env file exists with DATABASE_URL');
  process.exit(1);
}

try {
  // Ensure schema file exists
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema-combined.prisma');
  const fs = require('fs');
  
  if (!fs.existsSync(schemaPath)) {
    console.error('❌ Schema file not found:', schemaPath);
    console.log('💡 Run npm run schema:build first');
    process.exit(1);
  }

  // Set environment and run prisma validate
  const env = { 
    ...process.env,
    DATABASE_URL: process.env.DATABASE_URL
  };
  
  console.log('🚀 Running Prisma validation...');
  
  execSync('prisma validate --schema=prisma/schema-combined.prisma', {
    stdio: 'inherit',
    env: env,
    cwd: path.join(__dirname, '..')
  });
  
  console.log('✅ Schema validation successful!');
} catch (error) {
  console.error('❌ Schema validation failed');
  console.error('Error details:', error.message);
  process.exit(1);
}