// Prisma seed script - Seed database with TypeScript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create sample templates
    await prisma.workflowTemplate.createMany({
        data: [
            {
                name: 'Reservation Confirmation',
                description: 'Send confirmation emails for new reservations',
                industry: 'restaurant',
                category: 'customer_service',
            },
            // More templates...
        ],
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
