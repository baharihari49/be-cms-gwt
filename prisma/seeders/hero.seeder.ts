const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  try {
    // Hapus data yang ada sebelumnya
    console.log('🗑️ Deleting existing data...');
    await prisma.heroSection.deleteMany({});
    await prisma.socialMedia.deleteMany({});

    console.log('✅ Existing data deleted.');

    // Seed Hero Section
    console.log('📝 Seeding Hero Section...');
    const heroSection = await prisma.heroSection.create({
      data: {
        id: 'hero-main',
        welcomeText: 'Welcome to GWT',
        mainTitle: 'Growth With',
        highlightText: 'Technology',
        description: 'We empower businesses to thrive in the digital era through innovative technology solutions, custom software development, and digital transformation strategies.',
        logo: 'https://res.cloudinary.com/du0tz73ma/image/upload/v1234567890/gwt-logo.png', // Ganti dengan URL logo yang sesuai
        image: 'https://res.cloudinary.com/du0tz73ma/image/upload/c_crop,h_5304,w_3955/v1748762488/gwt-projects/annie-spratt-QckxruozjRg-unsplash_1_n0qvci.jpg',
        altText: 'GWT Team - Growth With Technology professionals working together',
        isActive: true,
      },
    });

    console.log(`✅ Hero Section created: ${heroSection.id}`);

    // Seed Social Media
    console.log('🔗 Seeding Social Media...');

    const socialMediaData = [
      {
        id: 'github-gwt',
        name: 'GitHub',
        url: 'https://github.com/gwt-company',
        order: 1,
        isActive: true,
      },
      {
        id: 'linkedin-gwt',
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/company/gwt-technology/',
        order: 2,
        isActive: true,
      },
      {
        id: 'instagram-gwt',
        name: 'Instagram',
        url: 'https://www.instagram.com/gwt.technology/',
        order: 3,
        isActive: true,
      },
      {
        id: 'email-gwt',
        name: 'Email',
        url: 'mailto:contact@gwt.com',
        order: 4,
        isActive: true,
      },
    ];

    // Insert social media data
    for (const socialData of socialMediaData) {
      const socialMedia = await prisma.socialMedia.create({
        data: socialData,
      });
      console.log(`✅ Social Media created: ${socialMedia.name}`);
    }

    // Verifikasi data yang sudah dibuat
    console.log('✅ Verifying seeded data...');
    
    const totalHeroSections = await prisma.heroSection.count();
    const totalSocialMedia = await prisma.socialMedia.count({ where: { isActive: true } });
    
    console.log(`📊 Total Hero Sections: ${totalHeroSections}`);
    console.log(`📊 Total Active Social Media: ${totalSocialMedia}`);

    console.log('🎉 Seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Export untuk bisa digunakan sebagai module
module.exports = { main };
