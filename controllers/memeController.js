// controllers/memeController.js
import { prisma } from '../lib/prisma.js';

/**
 * GET /memes
 * Returns memes with the author's basic info.
 */
export const getMemes = async (_req, res, next) => {
  try {
    const data = await prisma.meme.findMany({
      include: {
        user: { select: { id: true, username: true } },
      },
      orderBy: { id: 'asc' },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /memes/:id
 * Fetch one meme by id; 404 if not found.
 */
export const getMemeById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid meme id' });
    }

    const meme = await prisma.meme.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
    if (!meme) return res.status(404).json({ error: 'Meme not found' });

    res.json(meme);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /memes
 * If auth middleware set req.user, prefer that user as owner;
 * otherwise fall back to body.userId (keeps compatibility).
 */
export const createMeme = async (req, res, next) => {
  try {
    const { title, url, userId } = req.body ?? {};
    const authUserId = req.user?.userId; // set by authenticateToken (if used)
    const ownerId = authUserId ?? (Number.isInteger(Number(userId)) ? Number(userId) : null);

    if (!title || !url || !ownerId) {
      return res
        .status(400)
        .json({ error: 'title, url, and userId (or JWT) are required' });
    }

    const created = await prisma.meme.create({
      data: { title, url, userId: ownerId },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /memes/:id
 * Updates only provided fields; 404 if not found.
 */
export const updateMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid meme id' });
    }

    const { title, url } = req.body ?? {};
    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Meme not found' });

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

/**
 * DELETE /memes/:id
 * Deletes meme if it exists; 404 if not found.
 */
export const deleteMeme = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid meme id' });
    }

    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Meme not found' });

    const deleted = await prisma.meme.delete({ where: { id } });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /memes/:id/like
 * Toggles a like for the authenticated user.
 * If like exists -> remove it (unlike); otherwise -> create it (like).
 * Requires authenticateToken to set req.user.userId.
 */
export const toggleLike = async (req, res, next) => {
  try {
    const memeId = Number(req.params.id);
    if (!Number.isInteger(memeId)) {
      return res.status(400).json({ error: 'Invalid meme id' });
    }

    const userId = req.user?.userId; // set by auth middleware
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Ensure meme exists
    const meme = await prisma.meme.findUnique({ where: { id: memeId } });
    if (!meme) return res.status(404).json({ error: 'Meme not found' });

    // Check if a like already exists (composite unique: userId + memeId)
    const existing = await prisma.userLikesMeme.findUnique({
      where: { userId_memeId: { userId, memeId } },
    });

    if (existing) {
      await prisma.userLikesMeme.delete({ where: { id: existing.id } });
      return res.json({ message: 'Meme unliked' });
    } else {
      await prisma.userLikesMeme.create({ data: { userId, memeId } });
      return res.json({ message: 'Meme liked' });
    }
  } catch (err) {
    next(err);
  }
};




