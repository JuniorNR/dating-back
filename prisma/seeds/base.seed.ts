// import { PrismaClient } from ;
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { seedRoles } from './role.seed';
import { seedUsers } from './user.seed';
import { seedAnnouncementCategory } from './announcementCategory.seed';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('[seed][roles][inserting...]');
  await seedRoles(prisma);
  console.log('[seed][roles][inserted!]');

  console.log('[seed][users][inserting...]');
  await seedUsers(prisma);
  console.log('[seed][users][inserted!]');

  console.log('[seed][announcement-categories][inserting...]');
  await seedAnnouncementCategory(prisma);
  console.log('[seed][announcement-categories][inserted!]');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
