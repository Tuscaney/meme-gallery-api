// prisma/seed.js
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();


async function main() {
  // upsert so re-running seed is safe
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: { username: 'alice', password: 'pass1' }
  });

  await prisma.meme.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Distracted Boyfriend',
      url: 'https://i.imgur.com/example1.jpg',
      userId: alice.id
    }
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); return prisma.$disconnect(); });
