import express from "express";
import {
  getMemes,
  getMemeById,
  createMeme,   // alias to the typed handler in memeController.ts
  updateMeme,
  deleteMeme,
  toggleLike,
} from "../controllers/memeController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /memes — list all
router.get("/", getMemes);

// GET /memes/:id — single
router.get("/:id", getMemeById);

// POST /memes — create (PROTECTED)
router.post("/", authenticateToken, createMeme);

// PUT /memes/:id — update
router.put("/:id", updateMeme);

// DELETE /memes/:id — remove
router.delete("/:id", deleteMeme);

// POST /memes/:id/like — toggle like/unlike (PROTECTED)
router.post("/:id/like", authenticateToken, (req, res, next) => {
  // accept either scope or scopes arrays
  // @ts-ignore keep compatibility with current auth middleware typing
  const scopes = Array.isArray(req.user?.scope) ? req.user.scope : (req.user?.scopes ?? []);
  if (!scopes.includes("like:memes")) return res.status(403).send("Forbidden");
  return toggleLike(req, res, next);
});

export default router;
