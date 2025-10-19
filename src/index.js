// --- Env bootstrapping (must be first) ---
import "dotenv/config";

// --- Core imports ---
import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // already imported

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

// --- Minimal env sanity check (non-fatal) ---
if (!process.env.JWT_SECRET) {
  // Keep this as a warning (not exit) to avoid surprising behavior during demo
  console.warn("⚠️  JWT_SECRET is not set in .env — auth tokens may fail to verify.");
}
// --- end env sanity check ---

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

// Mount Routes
app.use("/auth", authRoutes);     // mount auth routes
app.use("/memes", memeRoutes);
app.use("/users", userRoutes);    // mount users routes

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

// Only listen when not running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Small visibility log to help with JWT debugging during local dev
    console.log(`JWT_SECRET present: ${!!process.env.JWT_SECRET}`);
  });
}

export default app; // (optional) helps with tests or future refactors






