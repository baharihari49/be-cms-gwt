// prisma/seeders/blog.seeder.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function untuk generate slug
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Data untuk blog authors
const authorsData = [
  {
    id: "cmbt1urar0000ww0q9brknzn0",
    name: "Bahari",
    role: "Developer & Content Creator",
    email: "baharihari49@gmail.com",
    bio: "",
    avatar: ""
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Developer & Content Creator",
    bio: "Frontend Developer yang fokus pada UI/UX design dan React ecosystem. Suka menulis tentang best practices dalam pengembangan frontend.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-sarah_avatar.jpg"
  },
  {
    name: "David Chen",
    email: "david.chen@example.com",
    role: "Developer & Content Creator",
    bio: "Backend Engineer dengan expertise dalam Node.js, Python, dan cloud infrastructure. Passionate tentang scalable architecture dan DevOps.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-david_avatar.jpg"
  },
  {
    name: "Alex Rodriguez",
    email: "alex.rodriguez@example.com",
    role: "Developer & Content Creator",
    bio: "Mobile Developer specializing in React Native and Flutter. Passionate about creating smooth user experiences across different platforms.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-alex_avatar.jpg"
  },
  {
    name: "Emma Wilson",
    email: "emma.wilson@example.com", 
    role: "Developer & Content Creator",
    bio: "DevOps Engineer dan Cloud Architect dengan pengalaman dalam AWS, Docker, dan Kubernetes. Fokus pada automation dan infrastructure as code.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-emma_avatar.jpg"
  },
  {
    name: "Michael Zhang",
    email: "michael.zhang@example.com",
    role: "Developer & Content Creator",
    bio: "Data Scientist dan AI/ML Engineer. Specialized dalam machine learning, deep learning, dan data analytics untuk business solutions.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-michael_avatar.jpg"
  },
  {
    name: "Jessica Taylor",
    email: "jessica.taylor@example.com",
    role: "Developer & Content Creator",
    bio: "UX/UI Designer dan Product Designer dengan 5+ tahun pengalaman. Passionate tentang user-centered design dan design systems.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-jessica_avatar.jpg"
  },
  {
    name: "Ryan Kumar",
    email: "ryan.kumar@example.com",
    role: "Developer & Content Creator",
    bio: "Full Stack Developer dengan expertise dalam JavaScript ecosystem. Fokus pada performance optimization dan scalable web applications.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-ryan_avatar.jpg"
  },
  {
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    role: "Developer & Content Creator",
    bio: "Cybersecurity Expert dan Penetration Tester. Specialized dalam web application security dan security best practices.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-lisa_avatar.jpg"
  },
  {
    name: "Ahmed Hassan",
    email: "ahmed.hassan@example.com", 
    role: "Developer & Content Creator",
    bio: "Blockchain Developer dan Web3 Engineer. Experienced dalam smart contracts, DeFi protocols, dan decentralized applications.",
    avatar: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/author-ahmed_avatar.jpg"
  }
];

// Data untuk blog categories
const categoriesData = [
  {
    id: "cmbt1gwjq0001wwrhoxjt1dn5",
    name: 'Frontend Development',
    slug: 'frontend-development',
    description: 'Articles about frontend technologies, frameworks, and best practices',
    icon: 'Code',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    name: 'Backend Development',
    slug: 'backend-development',
    description: 'Server-side programming, APIs, databases, and architecture',
    icon: 'Globe',
    color: 'from-green-500 to-emerald-400'
  },
  {
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'iOS, Android, React Native, Flutter and mobile app development',
    icon: 'Smartphone',
    color: 'from-purple-500 to-pink-400'
  },
  {
    name: 'AI & Machine Learning',
    slug: 'ai-machine-learning',
    description: 'Artificial Intelligence, ML algorithms, and data science',
    icon: 'Brain',
    color: 'from-orange-500 to-red-400'
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Cybersecurity, best practices, and security tools',
    icon: 'Shield',
    color: 'from-red-500 to-pink-400'
  },
  {
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, deployment, monitoring, and infrastructure',
    icon: 'TrendingUp',
    color: 'from-indigo-500 to-purple-400'
  },
  {
    name: 'Cloud Computing',
    slug: 'cloud-computing',
    description: 'AWS, Azure, GCP, and cloud architecture',
    icon: 'Cloud',
    color: 'from-sky-500 to-blue-400'
  },
  {
    name: 'Blockchain',
    slug: 'blockchain',
    description: 'Web3, cryptocurrencies, and blockchain development',
    icon: 'Link',
    color: 'from-violet-500 to-purple-400'
  },
  {
    name: 'UX/UI Design',
    slug: 'ux-ui-design',
    description: 'User experience, interface design, and design systems',
    icon: 'Palette',
    color: 'from-pink-500 to-rose-400'
  },
  {
    name: 'Database',
    slug: 'database',
    description: 'SQL, NoSQL, database design, and optimization',
    icon: 'Database',
    color: 'from-yellow-500 to-orange-400'
  }
];

// Data untuk blog tags
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
  'Cryptocurrency',
  'SaaS',
  'Web Development'
];

// Data untuk blog posts
const postsData = [
  {
    id: "cmbt1ybld0002ww0qn8sh867k",
    title: "Web Development untuk Platform SaaS: Membangun Website yang Skalable dan Efisien",
    slug: "web-development-untuk-platform-saas-membangun-website-yang-skalable-dan-efisien",
    excerpt: "Pelajari bagaimana web development dapat membangun website SaaS yang skalabel, efisien, dan aman, serta mendukung pengalaman pengguna yang optimal dan pertumbuhan platform.",
    content: `<h2>Apa Itu SaaS dan Mengapa Website Penting?</h2><p>Software as a Service (SaaS) adalah model distribusi perangkat lunak di mana aplikasi dihosting di cloud dan dapat diakses oleh pengguna melalui internet. Alih-alih menginstal perangkat lunak di komputer pribadi, pengguna SaaS hanya perlu mendaftar dan login untuk mengakses aplikasi. Model SaaS kini semakin populer karena kemudahan akses, fleksibilitas, dan efisiensi biaya.</p><p>Bagi platform SaaS, memiliki website yang baik adalah kunci untuk menarik pelanggan, menyediakan informasi produk, dan mempermudah proses pendaftaran dan penggunaan layanan. Website SaaS yang efektif tidak hanya menyediakan informasi tetapi juga mendukung fungsionalitas platform, termasuk fitur demo, pendaftaran pengguna, dan integrasi dengan sistem lain.</p><h2>Tugas dan Fungsi Website untuk Platform SaaS</h2><p>Website untuk platform SaaS memiliki beberapa fungsi kunci yang perlu dipenuhi untuk menjamin keberhasilan layanan:</p><ol><li><p><strong>Menampilkan Fitur dan Manfaat Produk</strong><br>Website harus jelas menjelaskan bagaimana produk SaaS bekerja dan manfaat yang dapat diperoleh pengguna. Hal ini penting untuk membantu calon pelanggan memahami nilai dari platform dan mendorong mereka untuk mencoba layanan.</p></li><li><p><strong>Memberikan Akses Pendaftaran dan Trial</strong><br>Banyak platform SaaS menawarkan uji coba gratis. Website harus memiliki halaman pendaftaran yang sederhana dan cepat, memungkinkan pengguna untuk mencoba layanan tanpa hambatan. Proses pendaftaran yang mudah akan meningkatkan konversi pengguna baru.</p></li><li><p><strong>Menyediakan Dokumentasi dan Dukungan Pengguna</strong><br>Dokumentasi yang jelas dan dukungan pelanggan sangat penting dalam SaaS. Website harus memiliki halaman FAQ, tutorial, dan support center yang memudahkan pengguna untuk menemukan jawaban atas masalah mereka.</p></li><li><p><strong>Mengelola Pembayaran dan Akun Pengguna</strong><br>Website juga harus mengelola pembaruan akun pengguna dan transaksi pembayaran. Pengguna harus dapat dengan mudah mengelola langganan mereka, memperbarui informasi pembayaran, dan mengakses riwayat penggunaan.</p></li><li><p><strong>Keamanan dan Keandalan</strong><br>Mengingat banyaknya data sensitif yang dikelola oleh platform SaaS, website harus dilengkapi dengan langkah-langkah keamanan yang kuat, seperti enkripsi data dan autentikasi dua faktor, untuk melindungi informasi pengguna.</p></li></ol>`,
    image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748987310/microsoft-365-bWL-c09Ys80-unsplash_lan2mf.jpg",
    featured: true,
    published: true,
    readTime: "5 min",
    authorId: "cmbt1urar0000ww0q9brknzn0",
    categoryId: "cmbt1gwjq0001wwrhoxjt1dn5",
    publishedAt: "2025-06-12T07:23:35.856Z",
    tags: ["Web Development", "SaaS", "Scalability", "Security"],
    stats: {
      views: 50,
      likes: 12,
      comments: 3,
      shares: 5
    }
  },
  {
    title: "React Hook: useEffect untuk Pemula",
    excerpt: "Panduan lengkap memahami React useEffect hook, dari konsep dasar hingga implementasi advanced untuk management side effects dalam aplikasi React.",
    content: `<h2>Apa itu useEffect?</h2><p>useEffect adalah salah satu React Hook yang paling penting untuk mengelola side effects dalam functional components. Side effects mencakup operasi seperti data fetching, subscriptions, atau manual DOM manipulation.</p><h2>Syntax Dasar useEffect</h2><p>useEffect menerima dua parameter: function yang berisi logic side effect, dan optional dependency array.</p><pre><code>import { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Side effect logic here
    fetchData().then(setData);
  }, []); // Dependency array

  return <div>{data}</div>;
}</code></pre>`,
    image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1747667261/mohammad-rahmani-_Fx34KeqIEw-unsplash_q0wc20.jpg",
    featured: false,
    published: true,
    readTime: "8 min",
    authorId: "sarah-johnson-id", // Will be replaced with actual ID
    categoryId: "frontend-dev-id", // Will be replaced with actual ID
    tags: ["React", "Hooks", "useEffect", "JavaScript", "Frontend"],
    stats: {
      views: 120,
      likes: 25,
      comments: 8,
      shares: 12
    }
  },
  {
    title: "Microservices Architecture dengan Node.js",
    excerpt: "Membangun microservices architecture yang scalable menggunakan Node.js, Docker, dan message queues untuk aplikasi enterprise modern.",
    content: `<h2>Apa itu Microservices?</h2><p>Microservices adalah architectural pattern yang memecah aplikasi monolith menjadi service-service kecil yang independent, masing-masing running di process terpisah dan berkomunikasi via well-defined APIs.</p><h2>Keuntungan Microservices</h2><ul><li>Scalability yang lebih baik</li><li>Technology diversity</li><li>Fault isolation</li><li>Team autonomy</li></ul>`,
    image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748551301/boitumelo-mA29hJXQHGs-unsplash_qtxb7m.jpg",
    featured: true,
    published: true,
    readTime: "12 min",
    authorId: "david-chen-id", // Will be replaced with actual ID
    categoryId: "backend-dev-id", // Will be replaced with actual ID
    tags: ["Node.js", "Microservices", "Architecture", "Docker", "Backend"],
    stats: {
      views: 89,
      likes: 18,
      comments: 5,
      shares: 7
    }
  }
];

// Function to clear all blog data
async function clearAllBlogData() {
  console.log('🗑️  Starting cleanup of all blog data...\n');
  
  try {
    // Delete in correct order due to foreign key constraints
    console.log('🗑️  Deleting blog post stats...');
    await prisma.blogPostStats.deleteMany({});
    
    console.log('🗑️  Deleting blog post tags relationships...');
    await prisma.blogPostTag.deleteMany({});
    
    console.log('🗑️  Deleting blog posts...');
    await prisma.blogPost.deleteMany({});
    
    console.log('🗑️  Deleting blog tags...');
    await prisma.blogTag.deleteMany({});
    
    console.log('🗑️  Deleting blog categories...');
    await prisma.blogCategory.deleteMany({});
    
    console.log('🗑️  Deleting blog authors...');
    await prisma.blogAuthor.deleteMany({});
    
    console.log('✅ All blog data cleared successfully!\n');
  } catch (error) {
    console.error('❌ Error clearing blog data:', error);
    throw error;
  }
}

async function seedAuthors() {
  console.log('🌱 Seeding blog authors...');
  
  for (const author of authorsData) {
    try {
      await prisma.blogAuthor.create({
        data: {
          id: author.id || undefined,
          name: author.name,
          role: author.role,
          email: author.email,
          bio: author.bio,
          avatar: author.avatar
        }
      });
      console.log(`✅ Author created: ${author.name}`);
    } catch (error) {
      console.error(`❌ Error creating author ${author.name}:`, error);
    }
  }
  
  console.log('✅ Blog authors seeding completed!\n');
}

async function seedCategories() {
  console.log('🌱 Seeding blog categories...');
  
  for (const category of categoriesData) {
    try {
      await prisma.blogCategory.create({
        data: {
          id: category.id || undefined,
          name: category.name,
          slug: category.slug || generateSlug(category.name),
          description: category.description,
          icon: category.icon,
          color: category.color,
          postCount: 0
        }
      });
      console.log(`✅ Blog category created: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error creating blog category ${category.name}:`, error);
    }
  }
  
  console.log('✅ Blog categories seeding completed!\n');
}

async function seedTags() {
  console.log('🌱 Seeding blog tags...');
  
  for (const tagName of tagsData) {
    try {
      await prisma.blogTag.create({
        data: {
          name: tagName,
          slug: generateSlug(tagName)
        }
      });
      console.log(`✅ Blog tag created: ${tagName}`);
    } catch (error) {
      console.error(`❌ Error creating blog tag ${tagName}:`, error);
    }
  }
  
  console.log('✅ Blog tags seeding completed!\n');
}

async function seedPosts() {
  console.log('🌱 Seeding blog posts...');
  
  // Get created authors and categories for reference
  const authors = await prisma.blogAuthor.findMany();
  const categories = await prisma.blogCategory.findMany();
  
  for (const postData of postsData) {
    try {
      // Find author - either by ID or by placeholder
      let authorId = postData.authorId;
      if (postData.authorId.includes('sarah-johnson')) {
        const author = authors.find(a => a.name === 'Sarah Johnson');
        authorId = author?.id || authors[0].id;
      } else if (postData.authorId.includes('david-chen')) {
        const author = authors.find(a => a.name === 'David Chen');
        authorId = author?.id || authors[0].id;
      }
      
      // Find category - either by ID or by placeholder
      let categoryId = postData.categoryId;
      if (postData.categoryId.includes('frontend-dev')) {
        const category = categories.find(c => c.name === 'Frontend Development');
        categoryId = category?.id || categories[0].id;
      } else if (postData.categoryId.includes('backend-dev')) {
        const category = categories.find(c => c.name === 'Backend Development');
        categoryId = category?.id || categories[0].id;
      }

      // Create blog post
      const post = await prisma.blogPost.create({
        data: {
          id: postData.id || undefined,
          title: postData.title,
          slug: postData.slug || generateSlug(postData.title),
          excerpt: postData.excerpt,
          content: postData.content,
          image: postData.image,
          featured: postData.featured,
          published: postData.published,
          readTime: postData.readTime,
          authorId: authorId,
          categoryId: categoryId,
          publishedAt: postData.publishedAt ? new Date(postData.publishedAt) : new Date()
        }
      });

      // Handle post tags (many-to-many)
      for (const tagName of postData.tags) {
        const tag = await prisma.blogTag.findUnique({
          where: { name: tagName }
        });
        
        if (tag) {
          await prisma.blogPostTag.create({
            data: {
              postId: post.id,
              tagId: tag.id
            }
          });
        }
      }

      // Create post stats
      await prisma.blogPostStats.create({
        data: {
          postId: post.id,
          views: postData.stats.views,
          likes: postData.stats.likes,
          comments: postData.stats.comments,
          shares: postData.stats.shares
        }
      });

      console.log(`✅ Blog post created: ${postData.title}`);
    } catch (error) {
      console.error(`❌ Error creating blog post ${postData.title}:`, error);
    }
  }
  
  console.log('✅ Blog posts seeding completed!\n');
}

async function updateCategoryCounts() {
  console.log('🔄 Updating blog category counts...');
  
  try {
    const categories = await prisma.blogCategory.findMany();
    
    for (const category of categories) {
      const postCount = await prisma.blogPost.count({
        where: { 
          categoryId: category.id,
          published: true
        }
      });
      
      await prisma.blogCategory.update({
        where: { id: category.id },
        data: { postCount: postCount }
      });
      
      console.log(`✅ Updated count for ${category.name}: ${postCount} posts`);
    }
  } catch (error) {
    console.error('❌ Error updating blog category counts:', error);
  }
  
  console.log('✅ Blog category counts updated!\n');
}

async function main() {
  console.log('🚀 Starting blog seeder with data cleanup...\n');
  
  try {
    // Clear all existing blog data first
    await clearAllBlogData();
    
    // Seed fresh data
    await seedAuthors();
    await seedCategories();
    await seedTags();
    await seedPosts();
    await updateCategoryCounts();
        
    console.log('🎉 Blog seeding completed successfully!');
  } catch (error) {
    console.error('❌ Blog seeding failed:', error);
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