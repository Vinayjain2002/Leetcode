require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@leetcode.local' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@leetcode.local',
            passwordHash,
            firstName: 'Vinay',
            lastName: 'Jain',
            role: 'ADMIN',
            isTopVoice: true,
            streak: {
                create: { year: new Date().getFullYear(), streakGrid: {} }
            }
        }
    });

    console.log('Admin user:', admin.email);

    const tags = await Promise.all(
        ['Array', 'String', 'Hash Table', 'Dynamic Programming', 'Graph', 'Tree', 'Binary Search', 'Two Pointers']
            .map((tagName) => prisma.tag.upsert({ where: { tagName }, update: {}, create: { tagName } }))
    );

    console.log(`Seeded ${tags.length} tags`);
    console.log('Seed completed');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
