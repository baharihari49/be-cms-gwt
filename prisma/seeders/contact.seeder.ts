import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.contact.deleteMany()

  // Seed contact data
  const contacts = await prisma.contact.createMany({
    data: [
      {
        title: 'Call Us',
        details: ['(+62) 811-121-487', 'Mon-Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
        color: 'bg-gradient-to-r from-green-500 to-emerald-400',
        href: 'tel:+6281385555749'
      },
      {
        title: 'Email Us',
        details: ['iman.dipradja@gwt.co.id', '24/7 Response Time'],
        color: 'bg-gradient-to-r from-blue-500 to-cyan-400',
        href: 'mailto:iman.dipradja@gwt.co.id'
      },
      {
        title: 'Visit Us',
        details: ['123 Tech Street', 'Silicon Valley, CA 94000', 'United States'],
        color: 'bg-gradient-to-r from-purple-500 to-pink-400',
        href: 'https://maps.google.com/?q=123+Tech+Street+Silicon+Valley+CA'
      },
      {
        title: 'Working Hours',
        details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 10:00 AM - 4:00 PM', 'Sunday: Closed'],
        color: 'bg-gradient-to-r from-orange-500 to-red-400',
        href: null
      }
    ]
  })

  console.log(`Created ${contacts.count} contacts`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })