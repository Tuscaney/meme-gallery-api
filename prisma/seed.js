// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // upsert so re-running is safe
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: { username: 'alice', password: 'pass1' },
  });

  await prisma.meme.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Distracted Boyfriend',
      url: 'https://i.imgur.com/example1.jpg',
      userId: alice.id,
    },
  });

  console.log('✅ Seed complete for user:', alice.username);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

