// routes/memeRoutes.js
import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

// GET /memes — list all (includes author username)
router.get("/", async (_req, res, next) => {
  try {
    const memes = await prisma.meme.findMany({
      include: { user: { select: { id: true, username: true } } },
      orderBy: { id: "asc" },
    });
    res.json(memes);
  } catch (e) {
    next(e);
  }
});

// GET /memes/:id — single meme
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const meme = await prisma.meme.findUnique({
      where: { id },
      include: { user: { select: { id: true, username: true } } },
    });
    if (!meme) return res.status(404).json({ error: "Meme not found" });
    res.json(meme);
  } catch (e) {
    next(e);
  }
});

// POST /memes — create (PROTECTED)
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { title, url } = req.body || {};
    if (!title || !url) {
      return res.status(400).json({ error: "title and url are required" });
    }
    const meme = await prisma.meme.create({
      data: { title, url, userId: req.user.userId },
    });
    res.status(201).json(meme);
  } catch (e) {
    next(e);
  }
});

// PUT /memes/:id — update title/url
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, url } = req.body || {};

    const exists = await prisma.meme.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Meme not found" });

    const updated = await prisma.meme.update({
      where: { id },
      data: {
        title: title ?? exists.title,
        url: url ?? exists.url,
      },
    });
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /memes/:id — remove meme
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const exists = await prisma.meme.findUnique({ where: { id } });
    if (!exists) return res.status(404).json({ error: "Meme not found" });

    const deleted = await prisma.meme.delete({ where: { id } });
    res.json(deleted);
  } catch (e) {
    next(e);
  }
});

export default router;

