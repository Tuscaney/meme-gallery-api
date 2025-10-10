// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: { username: 'alice', password: 'pass1' },
  });

  // create the meme only if an identical one doesn't already exist
  const existing = await prisma.meme.findFirst({
    where: { title: 'Distracted Boyfriend', url: 'https://i.imgur.com/example1.jpg', userId: alice.id },
    select: { id: true },
  });

  if (!existing) {
    await prisma.meme.create({
      data: {
        title: 'Distracted Boyfriend',
        url: 'https://i.imgur.com/example1.jpg',
        userId: alice.id,
      },
    });
  }

  console.log('✅ Seed complete for user:', alice.username);
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());

