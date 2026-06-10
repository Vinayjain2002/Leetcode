const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {

    await prisma.user.create({
        data: {
            username: "admin",
            firstName: "Vinay",
            lastName: "Jain",
            isTopVoice: true
        }
    });

    console.log("Seed completed");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });