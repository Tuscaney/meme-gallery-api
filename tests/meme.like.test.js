import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../index.js';
import { prisma } from '../lib/prisma.js';

const secret = process.env.JWT_SECRET || 'Jo4+JmTX8cnumjWO/YRdrBjrh1SIsNGqeD5ew2xmYQI=';

function tokenFor(userId = 1) {
  return jwt.sign({ userId, role: 'USER', scope: ['like:memes'] }, secret, { expiresIn: '1h' });
}

test('Meme like toggle (like then unlike) and invalid id validation', async (t) => {
  // Arrange: ensure user + meme exist; clear any prior like
  const alice = await prisma.user.upsert({
    where: { username: 'alice' },
    update: {},
    create: { username: 'alice', password: 'pass1' }, // <-- upsert uses create, not data
  });

  await prisma.meme.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, title: 'Distracted Boyfriend', url: 'https://i.imgur.com/example1.jpg', userId: alice.id }, // <-- create
  });

  await prisma.userLikesMeme.deleteMany({ where: { userId: alice.id, memeId: 1 } });
  const TOKEN = tokenFor(alice.id);

  await t.test('POST /memes/1/like → 200 "Meme liked"', async () => {
    const res = await request(app).post('/memes/1/like').set('Authorization', `Bearer ${TOKEN}`);
    assert.equal(res.status, 200, `unexpected status ${res.status}: ${res.text}`);
    assert.match(res.body?.message ?? '', /liked/i);
  });

  await t.test('POST /memes/1/like (again) → 200 "Meme unliked"', async () => {
    const res = await request(app).post('/memes/1/like').set('Authorization', `Bearer ${TOKEN}`);
    assert.equal(res.status, 200, `unexpected status ${res.status}: ${res.text}`);
    assert.match(res.body?.message ?? '', /unliked/i);
  });

  await t.test('POST /memes/abc/like → 400 invalid id', async () => {
    const res = await request(app).post('/memes/abc/like').set('Authorization', `Bearer ${TOKEN}`);
    assert.equal(res.status, 400, `unexpected status ${res.status}: ${res.text}`);
  });

  await prisma.$disconnect();
});
