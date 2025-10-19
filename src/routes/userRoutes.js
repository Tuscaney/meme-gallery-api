// routes/userRoutes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/:id/memes", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid user id" });

    const userWithMemes = await prisma.user.findUnique({
      where: { id },
      include: { memes: true }
    });

    if (!userWithMemes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userWithMemes.memes);
  } catch (err) {
    next(err);
  }
});

export default router;

