// prisma/seeders/blog.seeder.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function untuk generate slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Data untuk categories
const categoriesData = [
  {
    name: 'Frontend Development',
    description: 'Articles about frontend technologies, frameworks, and best practices',
    icon: 'Code',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    name: 'Backend Development',
    description: 'Server-side programming, APIs, databases, and architecture',
    icon: 'Globe',
    color: 'from-green-500 to-emerald-400'
  },
  {
    name: 'Mobile Development',
    description: 'iOS, Android, React Native, Flutter and mobile app development',
    icon: 'Smartphone',
    color: 'from-purple-500 to-pink-400'
  },
  {
    name: 'AI & Machine Learning',
    description: 'Artificial Intelligence, ML algorithms, and data science',
    icon: 'Brain',
    color: 'from-orange-500 to-red-400'
  },
  {
    name: 'Security',
    description: 'Cybersecurity, best practices, and security tools',
    icon: 'Shield',
    color: 'from-red-500 to-pink-400'
  },
  {
    name: 'DevOps',
    description: 'CI/CD, deployment, monitoring, and infrastructure',
    icon: 'TrendingUp',
    color: 'from-indigo-500 to-purple-400'
  },
  {
    name: 'Cloud Computing',
    description: 'AWS, Azure, GCP, and cloud architecture',
    icon: 'Cloud',
    color: 'from-sky-500 to-blue-400'
  },
  {
    name: 'Blockchain',
    description: 'Web3, cryptocurrencies, and blockchain development',
    icon: 'Link',
    color: 'from-violet-500 to-purple-400'
  },
  {
    name: 'UX/UI Design',
    description: 'User experience, interface design, and design systems',
    icon: 'Palette',
    color: 'from-pink-500 to-rose-400'
  },
  {
    name: 'Database',
    description: 'SQL, NoSQL, database design, and optimization',
    icon: 'Database',
    color: 'from-yellow-500 to-orange-400'
  }
];

// Data untuk tags
const tagsData = [
  // Frontend tags
  'React',
  'Vue.js',
  'Angular',
  'Next.js',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'SASS',
  'Webpack',
  'Vite',
  
  // Backend tags
  'Node.js',
  'Express.js',
  'Python',
  'Django',
  'Ruby on Rails',
  'PHP',
  'Laravel',
  'Java',
  'Spring Boot',
  'Go',
  'Rust',
  
  // Database tags
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Elasticsearch',
  'Prisma',
  'TypeORM',
  'Sequelize',
  
  // Cloud & DevOps tags
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'CI/CD',
  'GitHub Actions',
  'Jenkins',
  'Terraform',
  'Ansible',
  
  // Mobile tags
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',
  'iOS',
  'Android',
  'Ionic',
  
  // General tags
  'Best Practices',
  'Tutorial',
  'Performance',
  'Optimization',
  'Architecture',
  'Design Patterns',
  'Testing',
  'Security',
  'Authentication',
  'API',
  'REST',
  'GraphQL',
  'WebSocket',
  'Microservices',
  'Serverless',
  'Edge Computing',
  'Machine Learning',
  'Artificial Intelligence',
  'Data Science',
  'Big Data',
  'Blockchain',
  'Web3',
  'NFT',
  'Cryptocurrency'
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  for (const category of categoriesData) {
    try {
      await prisma.blogCategory.upsert({
        where: { name: category.name },
        update: {
          description: category.description,
          icon: category.icon,
          color: category.color
        },
        create: {
          name: category.name,
          slug: generateSlug(category.name),
          description: category.description,
          icon: category.icon,
          color: category.color,
          postCount: 0
        }
      });
      console.log(`✅ Category created/updated: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error creating category ${category.name}:`, error);
    }
  }
  
  console.log('✅ Categories seeding completed!\n');
}

async function seedTags() {
  console.log('🌱 Seeding tags...');
  
  for (const tagName of tagsData) {
    try {
      await prisma.blogTag.upsert({
        where: { name: tagName },
        update: {},
        create: {
          name: tagName,
          slug: generateSlug(tagName)
        }
      });
      console.log(`✅ Tag created/updated: ${tagName}`);
    } catch (error) {
      console.error(`❌ Error creating tag ${tagName}:`, error);
    }
  }
  
  console.log('✅ Tags seeding completed!\n');
}

async function main() {
  console.log('🚀 Starting blog seeder...\n');
  
  try {
    // Seed categories
    await seedCategories();
    
    // Seed tags
    await seedTags();
        
    console.log('🎉 All seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Execute seeder
main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });