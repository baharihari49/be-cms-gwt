import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Seed FAQ Categories
  const categories = [
    { id: 'general', name: 'General', icon: 'HelpCircle' },
    { id: 'services', name: 'Services', icon: 'CheckCircle' },
    { id: 'process', name: 'Process', icon: 'Clock' },
    { id: 'pricing', name: 'Pricing', icon: 'ArrowRight' },
    { id: 'support', name: 'Support', icon: 'Phone' }
  ]

  for (const category of categories) {
    await prisma.fAQCategory.upsert({
      where: { id: category.id },
      update: {},
      create: category
    })
  }

  console.log('Categories seeded successfully')

  // Seed FAQ Items
  const faqItems = [
    {
      id: 1,
      category: 'general',
      question: 'What services does GWT provide?',
      answer: 'GWT provides comprehensive technology solutions including custom software development, mobile application development, web development, cloud solutions, AI & Machine Learning implementation, cybersecurity services, and ongoing IT support. We specialize in helping businesses transform digitally and grow through innovative technology.',
      popular: true
    },
    {
      id: 2,
      category: 'general',
      question: 'How long has GWT been in business?',
      answer: 'GWT has over 7 years of experience in the technology industry. We started as CIB Productions in 2018 and rebranded to GWT (Growth With Technology) in 2025 to better reflect our expanded vision and commitment to innovation.',
      popular: true
    },
    {
      id: 3,
      category: 'services',
      question: 'Do you develop both mobile and web applications?',
      answer: 'Yes, we develop both mobile and web applications. Our mobile development expertise includes iOS and Android native apps as well as cross-platform solutions. For web development, we create responsive websites, web applications, and progressive web apps using modern technologies and frameworks.',
      popular: true
    },
    {
      id: 4,
      category: 'services',
      question: 'What technologies do you work with?',
      answer: 'We work with a wide range of modern technologies including React, Next.js, Node.js, Python, Flutter, React Native, AWS, Azure, MongoDB, PostgreSQL, and many more. Our team stays updated with the latest technology trends to provide cutting-edge solutions.',
      popular: false
    },
    {
      id: 5,
      category: 'process',
      question: 'What is your development process?',
      answer: 'Our development process consists of four main phases: 1) Consultation - analyzing your requirements and providing recommendations, 2) Planning - strategic planning and technical architecture design, 3) Development - agile development with regular updates, and 4) Support - ongoing maintenance and technical support.',
      popular: true
    },
    {
      id: 6,
      category: 'process',
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary depending on complexity and scope. Simple websites typically take 2-4 weeks, mobile apps 8-16 weeks, and complex enterprise solutions 3-6 months or more. We provide detailed timelines during the planning phase and keep you updated throughout development.',
      popular: false
    },
    {
      id: 7,
      category: 'pricing',
      question: 'How do you price your projects?',
      answer: 'We offer flexible pricing models including fixed-price projects, hourly rates, and retainer agreements. Pricing depends on project scope, complexity, timeline, and required technologies. We provide detailed quotes after understanding your specific requirements during our free consultation.',
      popular: false
    },
    {
      id: 8,
      category: 'pricing',
      question: 'Do you offer ongoing support and maintenance?',
      answer: 'Yes, we provide comprehensive ongoing support and maintenance services. This includes bug fixes, security updates, feature enhancements, performance optimization, and 24/7 technical support. We offer various support packages to meet different business needs.',
      popular: true
    },
    {
      id: 9,
      category: 'support',
      question: 'What kind of support do you provide after project completion?',
      answer: 'We provide comprehensive post-launch support including bug fixes, security updates, performance monitoring, feature enhancements, and technical assistance. Our support packages range from basic maintenance to full managed services with 24/7 monitoring.',
      popular: false
    },
    {
      id: 10,
      category: 'support',
      question: 'Do you provide training for our team?',
      answer: 'Yes, we provide comprehensive training for your team on how to use and manage the solutions we develop. This includes user training, administrator training, and technical documentation. We ensure your team is confident in using the new systems.',
      popular: false
    }
  ]

  for (const item of faqItems) {
    await prisma.fAQItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        category: item.category,
        question: item.question,
        answer: item.answer,
        popular: item.popular
      }
    })
  }

  console.log('FAQ Items seeded successfully')
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('Seeding completed successfully!')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })