// prisma/seeders/teamMember.seeder.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Hapus semua data lama (opsional, agar seeding idempotent)
  await prisma.teamMember.deleteMany();

  // Buat data baru
  await prisma.teamMember.createMany({
    data: [
      {
        name: "Hartono",
        position: "Co-Founder & CTO",
        department: "Leadership",
        bio: "Hartono currently serves as Co-Founder & Chief Technology Officer (CTO) at PT Growth With Technology (GWT), a company that operates in the field of providing IT solutions, both in hardware and software. With more than 6 years of experience in the technology industry, Hartono has expertise in system development, technology infrastructure, and digital innovation.",
        avatar: "H",
        skills: JSON.stringify([
          "System Development",
          "Technology Infrastructure",
          "Digital Innovation",
          "Hardware & Software Solutions"
        ]),
        experience: "6+ Years",
        projects: "100+ Projects",
        speciality: "Technology Leadership",
        social: JSON.stringify({
          linkedin: "https://linkedin.com/in/hartono",
          github:   "https://github.com/hartono",
          email:    "hartono@gwt.com"
        }),
        gradient: "from-blue-500 to-cyan-400",
        icon:     "Code",
        achievements: JSON.stringify([
          "Technology Infrastructure Expert",
          "Digital Innovation Leader",
          "System Architecture Specialist"
        ])
      },
      {
        name: "Iman Dipradja",
        position: "Co-Founder & COO",
        department: "Leadership",
        bio: "Iman has been working in the world of sales and marketing since 2013. He has served as General Manager at Bebek H Slamet Group, Country Sales Manager at PT EVMoto Technology Indonesia. Currently, he is fully dedicated to PT Growth With Technology, committed to advancing and developing PT GWT.",
        avatar: "ID",
        skills: JSON.stringify([
          "Sales Management",
          "Marketing Strategy",
          "Business Development",
          "Operations Management"
        ]),
        experience: "10+ Years",
        projects: "150+ Projects",
        speciality: "Business Operations",
        social: JSON.stringify({
          linkedin: "https://linkedin.com/in/imandipradja",
          github:   "https://github.com/imandipradja",
          email:    "iman@gwt.com"
        }),
        gradient: "from-purple-500 to-pink-400",
        icon:     "TrendingUp",
        achievements: JSON.stringify([
          "Sales & Marketing Expert",
          "Business Development Leader",
          "Operations Management Specialist"
        ])
      }
    ]
  });

  console.log("✅ Seeding TeamMember selesai");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
