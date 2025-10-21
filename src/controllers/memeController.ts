// Keep behavior identical to JS version.
// Strong types on handlers (Request, Response, NextFunction)
// POST /memes validated with memeSchema and typed with Meme
// No scope check here (you already do that in the route); only auth/user checks.

import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { memeSchema } from "../lib/validation.js";
import type { Meme } from "../types/index.js";

/** GET /memes — list all (includes author username) */
export const getMemes = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.meme.findMany({
      include: { user: { select: { id: true, username: true } } },
      orderBy: { id: "asc" },
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/** GET /memes/:id — single meme */
export const getMemeById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid meme id" });

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

/** POST /memes — strongly typed + validated */
export const addMeme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate body (title, url)
    const { error } = memeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details?.[0]?.message ?? "Invalid request body" });
    }

    const { title, url } = req.body as { title: string; url: string };

    // Prefer userId from JWT (set by authenticateToken)
    const authUserId = req.user?.userId;
    const bodyUserId = (req.body as Partial<Meme>)?.userId;
    const ownerId =
      (typeof authUserId === "number" && Number.isInteger(authUserId) && authUserId) ||
      (typeof bodyUserId === "number" && Number.isInteger(bodyUserId) && bodyUserId) ||
      null;

    if (!title || !url || !ownerId) {
      return res
        .status(400)
        .json({ error: "title, url, and userId (from JWT or body) are required" });
    }

    const created = await prisma.meme.create({
      data: { title, url, userId: ownerId } as Meme,
    });

    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// Alias to keep routes that import `createMeme` unchanged
export const createMeme = addMeme;

/** PUT /memes/:id — update title/url (partial) */
export const updateMeme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid meme id" });

    const { title, url } = (req.body ?? {}) as Partial<Meme>;
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

/** DELETE /memes/:id */
export const deleteMeme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid meme id" });

    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Meme not found" });

    const deleted = await prisma.meme.delete({ where: { id } });
    res.json(deleted);
  } catch (err) {
    next(err);
  }
};

/** POST /memes/:id/like — toggle like/unlike for authenticated user */
export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memeId = Number(req.params.id);
    if (!Number.isInteger(memeId)) return res.status(400).json({ error: "Invalid meme id" });

    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Ensure meme exists
    const meme = await prisma.meme.findUnique({ where: { id: memeId } });
    if (!meme) return res.status(404).json({ error: "Meme not found" });

    // Check if like already exists (composite unique: userId + memeId)
    const existing = await prisma.userLikesMeme.findUnique({
      where: { userId_memeId: { userId, memeId } },
    });

    if (existing) {
      await prisma.userLikesMeme.delete({ where: { id: existing.id } });
      return res.json({ message: "Meme unliked" });
    } else {
      await prisma.userLikesMeme.create({ data: { userId, memeId } });
      return res.json({ message: "Meme liked" });
    }
  } catch (err) {
    next(err);
  }
};
