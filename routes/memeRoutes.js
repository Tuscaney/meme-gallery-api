import express from "express";
// Use controller functions (keeps DB logic out of routes)
import {
  getMemes,
  getMemeById,
  createMeme,
  updateMeme,
  deleteMeme,
  toggleLike, // like/unlike toggle
} from "../controllers/memeController.js";
// Auth middleware to protect certain routes
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /memes — list all (includes author username)
router.get("/", getMemes);

// GET /memes/:id — single meme
router.get("/:id", getMemeById);

// POST /memes — create (PROTECTED: requires Bearer token)
router.post("/", authenticateToken, createMeme);

// PUT /memes/:id — update title/url
router.put("/:id", updateMeme);

// DELETE /memes/:id — remove meme
router.delete("/:id", deleteMeme);

// POST /memes/:id/like — toggle like/unlike (PROTECTED)
router.post("/:id/like", authenticateToken, toggleLike);

export default router;

