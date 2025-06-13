// prisma/seeders/portfolio.seeder.ts
import { PrismaClient, ProjectStatus, ImageType } from "@prisma/client";

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
    id: "web",
    label: "Web App"
  },
  {
    id: "mobile",
    label: "Mobile App"
  },
  {
    id: "desktop",
    label: "Desktop App"
  },
  {
    id: "design",
    label: "Design"
  },
  {
    id: "ecommerce",
    label: "E-Commerce"
  }
];

// Data untuk technologies
const technologiesData = [
  "Next.js",
  "React",
  "Vue.js",
  "Angular",
  "Node.js",
  "Express.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Django",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Prisma",
  "Ubuntu",
  "ShadCN UI",
  "Tailwind CSS",
  "Material-UI",
  "Chart.js"
];

// Data untuk features
const featuresData = [
  "Real-time Analytics",
  "Portfolio Management",
  "User Authentication",
  "Responsive Design",
  "Dashboard",
  "API Integration",
  "Database Management",
  "Performance Optimization",
  "Security Features",
  "Mobile Responsive",
  "Task Management",
  "Budget Tracking",
  "Expense Categorization",
  "Financial Reports",
  "Easy to Use Interface",
  "No Technical Skills Required",
  "Agile Development Process",
  "Increased Development Speed"
];

// Data untuk projects
const projectsData = [
  {
    title: "Task Manager",
    subtitle: "Smart Task Manager",
    categoryId: "web",
    type: "Web Application",
    description: "This is a smart task manager project for managing your tasks, and can increase your development product process by 50%. Built with modern web technologies and designed for ease of use.",
    image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1746644294/Macbook-Air-nexdo.baharihari.com_nrcq8y.png",
    clientId: null,
    duration: "2 weeks",
    year: "2024",
    status: ProjectStatus.LIVE,
    icon: null,
    color: "from-blue-500 to-cyan-400",
    technologies: [
      "Next.js",
      "Ubuntu",
      "Prisma",
      "Express.js",
      "MySQL",
      "ShadCN UI"
    ],
    features: [
      "No Technical Skills Required",
      "Easy to Use Interface",
      "Increased Development Speed"
    ],
    metrics: {
      users: null,
      performance: null,
      rating: null,
      downloads: null,
      revenue: null,
      uptime: null
    },
    links: {
      live: "https://taskmanager.demo.com",
      github: "https://github.com/user/task-manager",
      case: "https://taskmanager.demo.com/case-study",
      demo: "https://taskmanager.demo.com/demo",
      docs: "https://taskmanager.demo.com/docs"
    },
    images: [
      {
        url: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748551301/boitumelo-mA29hJXQHGs-unsplash_qtxb7m.jpg",
        caption: "Task Manager Dashboard",
        order: 0,
        type: ImageType.SCREENSHOT
      },
      {
        url: "https://res.cloudinary.com/du0tz73ma/image/upload/v1747336198/nathan-da-silva-k-rKfqSm4L4-unsplash_boymmy.jpg",
        caption: "Task Management Interface",
        order: 1,
        type: ImageType.SCREENSHOT
      }
    ]
  },
  {
    title: "FinanceFlow Dashboard",
    subtitle: "Financial Management Platform",
    categoryId: "web",
    type: "Web Application",
    description: "A comprehensive financial management platform for tracking expenses, managing budgets, and analyzing financial data with real-time insights and reporting capabilities.",
    image: "https://res.cloudinary.com/du0tz73ma/image/upload/v1746644294/finance-dashboard-preview.png",
    clientId: null,
    duration: "3 months",
    year: "2024",
    status: ProjectStatus.DEVELOPMENT,
    icon: null,
    color: "from-green-500 to-emerald-400",
    technologies: [
      "React",
      "PostgreSQL",
      "Node.js",
      "Express.js",
      "Chart.js",
      "Material-UI"
    ],
    features: [
      "Portfolio Management",
      "Real-time Analytics",
      "Budget Tracking",
      "Expense Categorization",
      "Financial Reports"
    ],
    metrics: {
      users: "10K+",
      performance: "99.9%",
      rating: null,
      downloads: null,
      revenue: null,
      uptime: null
    },
    links: {
      live: "https://financeflow.demo.com",
      github: "https://github.com/user/financeflow",
      case: null,
      demo: null,
      docs: null
    },
    images: []
  }
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');
  
  for (const category of categoriesData) {
    try {
      await prisma.category.upsert({
        where: { id: category.id },
        update: {
          label: category.label
        },
        create: {
          id: category.id,
          label: category.label,
          count: 0
        }
      });
      console.log(`✅ Category created/updated: ${category.label}`);
    } catch (error) {
      console.error(`❌ Error creating category ${category.label}:`, error);
    }
  }
  
  console.log('✅ Categories seeding completed!\n');
}

async function seedTechnologies() {
  console.log('🌱 Seeding technologies...');
  
  for (const techName of technologiesData) {
    try {
      await prisma.technology.upsert({
        where: { name: techName },
        update: {},
        create: {
          name: techName
        }
      });
      console.log(`✅ Technology created/updated: ${techName}`);
    } catch (error) {
      console.error(`❌ Error creating technology ${techName}:`, error);
    }
  }
  
  console.log('✅ Technologies seeding completed!\n');
}

async function seedFeatures() {
  console.log('🌱 Seeding features...');
  
  for (const featureName of featuresData) {
    try {
      await prisma.feature.upsert({
        where: { name: featureName },
        update: {},
        create: {
          name: featureName
        }
      });
      console.log(`✅ Feature created/updated: ${featureName}`);
    } catch (error) {
      console.error(`❌ Error creating feature ${featureName}:`, error);
    }
  }
  
  console.log('✅ Features seeding completed!\n');
}

async function seedProjects() {
  console.log('🌱 Seeding projects...');
  
  for (const projectData of projectsData) {
    try {
      // Create or update project
      const project = await prisma.project.upsert({
        where: { slug: generateSlug(projectData.title) },
        update: {
          title: projectData.title,
          subtitle: projectData.subtitle,
          categoryId: projectData.categoryId,
          type: projectData.type,
          description: projectData.description,
          image: projectData.image,
          clientId: projectData.clientId,
          duration: projectData.duration,
          year: projectData.year,
          status: projectData.status,
          icon: projectData.icon,
          color: projectData.color
        },
        create: {
          title: projectData.title,
          subtitle: projectData.subtitle,
          slug: generateSlug(projectData.title),
          categoryId: projectData.categoryId,
          type: projectData.type,
          description: projectData.description,
          image: projectData.image,
          clientId: projectData.clientId,
          duration: projectData.duration,
          year: projectData.year,
          status: projectData.status,
          icon: projectData.icon,
          color: projectData.color
        }
      });

      // Handle project technologies (many-to-many)
      await prisma.projectTechnology.deleteMany({
        where: { projectId: project.id }
      });

      for (const techName of projectData.technologies) {
        const technology = await prisma.technology.findUnique({
          where: { name: techName }
        });
        
        if (technology) {
          await prisma.projectTechnology.create({
            data: {
              projectId: project.id,
              technologyId: technology.id
            }
          });
        }
      }

      // Handle project features (many-to-many)
      await prisma.projectFeature.deleteMany({
        where: { projectId: project.id }
      });

      for (const featureName of projectData.features) {
        const feature = await prisma.feature.findUnique({
          where: { name: featureName }
        });
        
        if (feature) {
          await prisma.projectFeature.create({
            data: {
              projectId: project.id,
              featureId: feature.id
            }
          });
        }
      }

      // Create or update project metrics
      await prisma.projectMetric.upsert({
        where: { projectId: project.id },
        update: {
          users: projectData.metrics.users,
          performance: projectData.metrics.performance,
          rating: projectData.metrics.rating,
          downloads: projectData.metrics.downloads,
          revenue: projectData.metrics.revenue,
          uptime: projectData.metrics.uptime
        },
        create: {
          projectId: project.id,
          users: projectData.metrics.users,
          performance: projectData.metrics.performance,
          rating: projectData.metrics.rating,
          downloads: projectData.metrics.downloads,
          revenue: projectData.metrics.revenue,
          uptime: projectData.metrics.uptime
        }
      });

      // Create or update project links
      await prisma.projectLink.upsert({
        where: { projectId: project.id },
        update: {
          live: projectData.links.live,
          github: projectData.links.github,
          case: projectData.links.case,
          demo: projectData.links.demo,
          docs: projectData.links.docs
        },
        create: {
          projectId: project.id,
          live: projectData.links.live,
          github: projectData.links.github,
          case: projectData.links.case,
          demo: projectData.links.demo,
          docs: projectData.links.docs
        }
      });

      // Delete existing images and create new ones
      await prisma.projectImage.deleteMany({
        where: { projectId: project.id }
      });

      if (projectData.images && projectData.images.length > 0) {
        for (const image of projectData.images) {
          await prisma.projectImage.create({
            data: {
              projectId: project.id,
              url: image.url,
              caption: image.caption,
              order: image.order,
              type: image.type
            }
          });
        }
      }

      console.log(`✅ Project created/updated: ${projectData.title}`);
    } catch (error) {
      console.error(`❌ Error creating project ${projectData.title}:`, error);
    }
  }
  
  console.log('✅ Projects seeding completed!\n');
}

async function updateCategoryCounts() {
  console.log('🔄 Updating category counts...');
  
  try {
    const categories = await prisma.category.findMany();
    
    for (const category of categories) {
      const projectCount = await prisma.project.count({
        where: { categoryId: category.id }
      });
      
      await prisma.category.update({
        where: { id: category.id },
        data: { count: projectCount }
      });
      
      console.log(`✅ Updated count for ${category.label}: ${projectCount} projects`);
    }
  } catch (error) {
    console.error('❌ Error updating category counts:', error);
  }
  
  console.log('✅ Category counts updated!\n');
}

async function main() {
  console.log('🚀 Starting portfolio seeder...\n');
  
  try {
    // Seed master data first
    await seedCategories();
    await seedTechnologies();
    await seedFeatures();
    
    // Seed projects with relations
    await seedProjects();
    
    // Update category counts
    await updateCategoryCounts();
        
    console.log('🎉 Portfolio seeding completed successfully!');
  } catch (error) {
    console.error('❌ Portfolio seeding failed:', error);
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