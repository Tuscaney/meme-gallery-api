// controllers/memeController.ts
// Keep behavior identical to JS version.
// Only POST /memes is typed and validated.
// Export both `addMeme` and `createMeme` (alias) so routes need no changes.

import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { memeSchema } from "../lib/validation.js";
import type { Meme } from "../types/index.js";

/** GET /memes */
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

/** GET /memes/:id */
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
    if (error) throw new Error(error?.details?.[0]?.message || "Invalid request body");

    const { title, url } = req.body as { title: string; url: string };

    // Prefer userId from JWT (keeps class flow)
    // @ts-ignore will augment Express.Request later
    const authUserId = req.user?.userId as number | undefined;
    const ownerId = Number.isInteger(Number(authUserId)) ? Number(authUserId) : undefined;

    if (!title || !url || !ownerId) {
      return res.status(400).json({ error: "title, url, and userId (via JWT) are required" });
    }

    const created = await prisma.meme.create({
      data: { title, url, userId: ownerId } as Meme,
    });

    return res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
};

// Alias to keep routes unchanged (they import createMeme)
export const createMeme = addMeme;

/** PUT /memes/:id */
export const updateMeme = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid meme id" });

    const { title, url } = (req.body ?? {}) as Partial<Meme>;
    const existing = await prisma.meme.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Meme not found" });

    const updated = await prisma.meme.update({
      where: { id },
      data: { title: title ?? undefined, url: url ?? undefined },
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

/** POST /memes/:id/like */
export const toggleLike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const memeId = Number(req.params.id);
    if (!Number.isInteger(memeId)) return res.status(400).json({ error: "Invalid meme id" });

    // @ts-ignore keep same JWT shape as in JS
    const userId: number | undefined = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const meme = await prisma.meme.findUnique({ where: { id: memeId } });
    if (!meme) return res.status(404).json({ error: "Meme not found" });

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
