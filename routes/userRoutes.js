// routes/userRoutes.js
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// GET /users/:id/memes
router.get("/:id/memes", async (req, res) => {
  const { id } = req.params;

  try {
    const userWithMemes = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { memes: true }
    });

    if (!userWithMemes) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(userWithMemes.memes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
