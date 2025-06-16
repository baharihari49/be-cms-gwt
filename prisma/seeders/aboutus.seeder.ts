const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seeding...')

  // Clear existing data (optional)
  console.log('🧹 Clearing existing data...')
  await prisma.companyValue.deleteMany()
  await prisma.timelineItem.deleteMany()
  await prisma.companyStat.deleteMany()
  await prisma.companyInfo.deleteMany()

  // Seed Company Values
  console.log('📊 Seeding company values...')
  const values = [
    {
      icon: "Lightbulb",
      title: "Technology Innovation",
      description: "We always use cutting-edge technology and the latest innovations to create sophisticated and effective digital solutions.",
      color: "from-yellow-500 to-orange-500",
      order: 1
    },
    {
      icon: "Shield",
      title: "Security & Trust",
      description: "Every application we build prioritizes data security and systems that can be relied upon by clients.",
      color: "from-green-500 to-teal-500",
      order: 2
    },
    {
      icon: "Users",
      title: "Client Focus",
      description: "We are committed to understanding our clients' business needs and providing targeted solutions.",
      color: "from-blue-500 to-cyan-500",
      order: 3
    },
    {
      icon: "Zap",
      title: "Fast & Efficient Solutions",
      description: "With years of experience, we are able to provide fast and efficient digital solutions.",
      color: "from-purple-500 to-pink-500",
      order: 4
    }
  ]

  for (const value of values) {
    await prisma.companyValue.create({
      data: value
    })
  }

  // Seed Timeline Items
  console.log('📅 Seeding timeline items...')
  const timelineItems = [
    {
      year: "2018",
      title: "CIB Productions Founded",
      description: "Established with focus on mobile apps and websites for local SMEs.",
      achievement: "Serving SMEs",
      extendedDescription: "CIB Productions was established with a primary focus on developing mobile applications and websites for local SMEs, helping them establish a solid digital presence in the competitive market.",
      order: 1
    },
    {
      year: "2019-2024",
      title: "Growth & Experience",
      description: "Building expertise in modern technology and digital innovation.",
      achievement: "50+ Projects",
      extendedDescription: "Building various mobile and web applications, developing expertise in modern technology and digital innovation. We honed our skills across different platforms and technologies while serving dozens of satisfied clients.",
      order: 2
    },
    {
      year: "2025",
      title: "Rebranding to GWT",
      description: "Name change to GWT for broader vision and advanced solutions.",
      achievement: "Innovation Focus",
      extendedDescription: "Name change to GWT (Growth With Technology) as a rebranding step for a broader vision, marking our commitment to innovation and advanced solutions that drive business growth.",
      order: 3
    },
    {
      year: "2025+",
      title: "Future Vision",
      description: "Continuing innovation as trusted technology partner.",
      achievement: "Technology Leader",
      extendedDescription: "Continuing technological innovation and more advanced digital solutions to support client business growth, aiming to become the leading technology partner in the region.",
      order: 4
    }
  ]

  for (const item of timelineItems) {
    await prisma.timelineItem.create({
      data: item
    })
  }

  // Seed Company Stats
  console.log('📈 Seeding company stats...')
  const stats = [
    {
      icon: "Briefcase",
      number: "50+",
      label: "Projects Completed",
      order: 1
    },
    {
      icon: "Users",
      number: "7+",
      label: "Years Experience",
      order: 2
    },
    {
      icon: "Smartphone",
      number: "Mobile",
      label: "& Web Apps",
      order: 3
    },
    {
      icon: "Monitor",
      number: "SME",
      label: "Focus Area",
      order: 4
    }
  ]

  for (const stat of stats) {
    await prisma.companyStat.create({
      data: stat
    })
  }

  // Seed Company Info
  console.log('🏢 Seeding company info...')
  const companyInfo = {
    companyName: "GWT",
    previousName: "CIB Productions",
    foundedYear: "2018",
    mission: "To deliver innovative technology solutions through the development of mobile and web applications that streamline our clients' business operations. We are committed to helping SMEs and other businesses grow via effective, affordable digital transformation.",
    vision: "To become the leading technology partner that empowers businesses through digital innovation. We aim to be the top choice for advanced technology solutions, focusing on continuous technological innovation and superior digital capabilities.",
    aboutHeader: "Empowering Growth With Technology",
    aboutSubheader: "We are a passionate team of innovators, developers, and strategists dedicated to transforming businesses through cutting-edge technology solutions.",
    journeyTitle: "Our Journey",
    storyText: `Founding and Initial Focus: CIB Productions was founded in 2018 with a primary focus on developing mobile applications and websites. In the early years, the company concentrated on serving local small and medium enterprises (SMEs), helping them establish a solid digital presence.

Growth and Innovation: Over the years, CIB Productions continued to build applications that simplify clients' business operations. With extensive experience, we have honed our expertise in a wide range of modern technologies while staying up-to-date with the latest digital trends.

Rebranding to GWT: In 2025, CIB Productions underwent a name change to GWT (Growth With Technology) as part of a rebranding initiative to better reflect our renewed vision and mission. This transformation also marked our commitment to broader innovation and more advanced digital solutions.`,
    heroImageUrl: "https://res.cloudinary.com/du0tz73ma/image/upload/v1748762977/gwt-projects/austin-distel-rxpThOwuVgE-unsplash_by1qxu.jpg"
  }

  await prisma.companyInfo.create({
    data: companyInfo
  })

  console.log('✅ Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })