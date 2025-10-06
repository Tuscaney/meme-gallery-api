// index.js
import express from "express";
import memeRoutes from "./routes/memeRoutes.js";

const app = express();

// Parse JSON
app.use(express.json());

// Simple request logger
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} @ ${new Date().toISOString()}`);
  next();
});

// Health check
app.get("/", (_req, res) => {
  res.send("Meme Gallery API (Prisma) is running. Try GET /memes");
});

// Routes
app.use("/memes", memeRoutes);

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



