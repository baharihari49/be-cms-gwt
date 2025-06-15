// prisma/seeders/service.seeder.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Dummy technologyId lookup
    const techMap = await prisma.technology.findMany();
    const getTechId = (name: string) =>
        techMap.find((t) => t.name.toLowerCase() === name.toLowerCase())?.id;

    const services = [
        {
            icon: 'Code',
            title: 'Web Development',
            subtitle: 'Build responsive websites',
            description: 'We create high-performance and scalable websites using modern frameworks and best practices.',
            color: 'from-purple-500 to-indigo-600',
            features: ['Responsive Design', 'SEO Optimization', 'CMS Integration'],
            technologies: ['Next.js', 'React', 'Tailwind CSS'],
        },
        {
            icon: 'Server',
            title: 'Backend Development',
            subtitle: 'Robust server-side apps',
            description: 'Custom backend systems, APIs, and databases built for performance and security.',
            color: 'from-green-400 to-teal-600',
            features: ['RESTful API', 'Authentication', 'Database Design'],
            technologies: ['Node.js', 'Express', 'PostgreSQL'],
        },
        {
            icon: 'Smartphone',
            title: 'Mobile App Development',
            subtitle: 'iOS & Android apps',
            description: 'Developing mobile apps that are fast, intuitive, and platform-native.',
            color: 'from-pink-500 to-red-600',
            features: ['Cross-platform', 'Push Notifications', 'App Store Deployments'],
            technologies: ['React Native', 'Flutter', 'Firebase'],
        },
        {
            icon: 'ShieldCheck',
            title: 'Cybersecurity',
            subtitle: 'Secure your business',
            description: 'Comprehensive cybersecurity solutions including audits, firewalls, and monitoring.',
            color: 'from-yellow-400 to-orange-600',
            features: ['Security Audit', 'Firewall Setup', 'DDoS Protection'],
            technologies: ['Snort', 'Wireshark', 'Cloudflare'],
        },
    ];

    for (const s of services) {
        const service = await prisma.service.create({
            data: {
                icon: s.icon,
                title: s.title,
                subtitle: s.subtitle,
                description: s.description,
                color: s.color,
                features: {
                    create: s.features.map((f) => ({ name: f })),
                },
                technologies: {
                    create: s.technologies
                        .map((techName) => {
                            const id = getTechId(techName);
                            if (!id) return null;
                            return {
                                technologyId: id,
                                name: techName, // ✅ tambahkan ini
                            };
                        })
                        .filter((t): t is { technologyId: number; name: string } => t !== null),
                },

            },
        });

        console.log(`✅ Created service: ${service.title}`);
    }
}

main()
    .then(() => {
        console.log('🌱 Service seeding completed');
        return prisma.$disconnect();
    })
    .catch((err) => {
        console.error('❌ Error seeding services', err);
        return prisma.$disconnect();
    });
