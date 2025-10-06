// controllers/memeController.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET /memes
export const getMemes = async (_req, res, next) => {
  try {
    const data = await prisma.meme.findMany({
      include: { user: { select: { id: true, username: true } } },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// GET /memes/:id
export const getMemeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const meme = await prisma.meme.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
    if (!meme) return res.status(404).json({ error: "Meme not found" });
    res.json(meme);
  } catch (err) {
    next(err);
  }
};

// POST /memes
export const createMeme = async (req, res, next) => {
  try {
    const { title, url, userId } = req.body ?? {};
    if (!title || !url || !userId) {
      return res
        .status(400)
        .json({ error: "title, url, and userId are required" });
    }
    const created = await prisma.meme.create({
      data: { title, url, userId: Number(userId) },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /memes/:id
export const updateMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, url } = req.body ?? {};
    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Meme not found" });

    const updated = await prisma.meme.update({
      where: { id },
      data: {
        title: title ?? undefined,
        url: url ?? undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /memes/:id
export const deleteMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Meme not found" });

    const deleted = await prisma.meme.delete({ where: { id } });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};


