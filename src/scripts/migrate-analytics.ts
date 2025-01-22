import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function migrateAnalytics() {
  try {
    // Get all blinks without analyticsId
    const blinks = await prisma.blink.findMany({
      where: {
        analyticsId: null
      }
    });

    console.log(`Found ${blinks.length} blinks to migrate`);

    // Update each blink with a new analyticsId and create analytics record
    for (const blink of blinks) {
      const analyticsId = uuidv4();
      await prisma.blink.update({
        where: {
          id: blink.id
        },
        data: {
          analyticsId,
          analytics: {
            create: {
              totalVisits: 0,
              totalMails: 0,
              earnings: 0,
              visitorLocations: {},
              mailTimestamps: []
            }
          }
        }
      });
      console.log(`Migrated blink ${blink.id} with analytics ID ${analyticsId}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateAnalytics();