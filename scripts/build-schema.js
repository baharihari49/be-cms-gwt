// scripts/build-schema.js
const fs = require('fs');
const path = require('path');


// Load environment variables PERTAMA
require('dotenv').config();

// Daftar file schema yang akan digabungkan
const schemaFiles = [
  'models/user.prisma',
  'models/project.prisma', 
  'models/blog.prisma',
  'models/services.prisma',
  'models/tecnologies.prisma',
  'models/clients.prisma',
  'models/testimonials.prisma',
  'models/faq.prisma',
  'models/aboutus.prisma',
];

console.log('🔨 Building Prisma schema...');

try {
  // Baca file schema utama (yang berisi generator dan datasource)
  let combinedSchema = fs.readFileSync(path.join('prisma', 'schema.prisma'), 'utf8');
  
  console.log('✅ Read main schema.prisma');
  
  // Gabungkan semua file model
  schemaFiles.forEach((file, index) => {
    const filePath = path.join('prisma', file);
    
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      combinedSchema += '\n\n// ===============================================\n';
      combinedSchema += `// ${file.toUpperCase()}\n`;
      combinedSchema += '// ===============================================\n\n';
      combinedSchema += content;
      
      console.log(`✅ Added ${file}`);
    } else {
      console.log(`⚠️  Warning: ${file} not found, skipping...`);
    }
  });
  
  // Tulis file gabungan
  const outputPath = path.join('prisma', 'schema-combined.prisma');
  fs.writeFileSync(outputPath, combinedSchema);
  
  console.log(`\n🎉 Schema successfully built!`);
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Total files combined: ${schemaFiles.length + 1}`);
  
} catch (error) {
  console.error('❌ Error building schema:', error.message);
  process.exit(1);
}