// --- Env bootstrapping (must be first) ---
import "dotenv/config";

// --- Core imports ---
import express from "express";
import memeRoutes from "./routes/memeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

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
  console.warn("⚠️  JWT_SECRET is not set in .env — auth tokens may fail to verify.");
}
// --- end env sanity check ---

// --- DB health check route ---
app.get("/__dbcheck", async (_req, res, next) => {
  try {
    const rows = await prisma.$queryRaw`SELECT version()`;
    // @ts-ignore driver row shape varies
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
app.use("/auth", authRoutes);
app.use("/memes", memeRoutes);
app.use("/users", userRoutes);

// 404 for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: (err as Error)?.message || "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

// Only listen when not running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`JWT_SECRET present: ${!!process.env.JWT_SECRET}`);
  });
}

export default app;
