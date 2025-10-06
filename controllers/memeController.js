// controllers/memeController.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// GET /memes
export const getMemes = async (_req, res, next) => {
  try {
    const rows = await prisma.memes.findMany({
      include: { users: true },
      orderBy: { id: 'asc' },
    });
    res.json(rows);
  } catch (err) { next(err); }
};

// GET /memes/:id
export const getMemeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.memes.findUnique({ where: { id } });
    if (!row) return res.status(404).json({ error: 'Meme not found' });
    res.json(row);
  } catch (err) { next(err); }
};

// POST /memes
export const createMeme = async (req, res, next) => {
  try {
    const { title, url, userId } = req.body ?? {};
    if (!title || !url) {
      return res.status(400).json({ error: 'title and url required' });
    }
    const created = await prisma.memes.create({
      data: { title, url, user_id: userId ?? null }, // note: FK column is user_id
    });
    res.status(201).json(created);
  } catch (err) { next(err); }
};

// PUT /memes/:id
export const updateMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, url, userId } = req.body ?? {};
    const exists = await prisma.memes.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: 'Meme not found' });

    const updated = await prisma.memes.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(url !== undefined ? { url } : {}),
        ...(userId !== undefined ? { user_id: userId } : {}),
      },
    });
    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /memes/:id
export const deleteMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const exists = await prisma.memes.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: 'Meme not found' });
    const deleted = await prisma.memes.delete({ where: { id } });
    res.json(deleted);
  } catch (err) { next(err); }
};

