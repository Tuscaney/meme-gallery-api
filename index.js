// index.js
import "dotenv/config";
import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// --- Prisma (for DB health check) ---
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// --- end Prisma ---

const app = express();

// Parse JSON
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} @ ${new Date().toISOString()}`);
  next();
});

// --- DB health check route ---
app.get("/__dbcheck", async (_req, res, next) => {
  try {
    const rows = await prisma.$queryRaw`SELECT version()`;
    const version = rows?.[0]?.version ?? "unknown";
    res.json({ ok: true, version });
  } catch (err) {
    next(err);
  }
});
// --- end DB health check ---

// Health check
app.get("/", (_req, res) => {
  res.send("Meme Gallery API (Prisma) is running. Try GET /memes");
});

// Routes
app.use("/memes", memeRoutes);
app.use("/users", userRoutes); // <-- mount users routes

// 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





