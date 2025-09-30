import express from "express";

const app = express();

// Parse JSON bodies (ES6+)
app.use(express.json());

// Simple request logger 
function logger(req, _res, next) {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
}
app.use(logger);

// Handle malformed JSON early
app.use((err, _req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON body" });
  }
  next(err);
});

// In-memory data
let memes = [
  { id: 1, title: "Distracted Boyfriend", url: "https://i.imgur.com/example1.jpg" },
  { id: 2, title: "Success Kid", url: "https://i.imgur.com/example2.jpg" }
  
];

// Validation helper
const validateMeme = ({ title, url }) => {
  if (typeof title !== "string" || typeof url !== "string") return false;
  const t = title.trim();
  const u = url.trim();
  if (!t || !u) return false;
  try {
    new URL(u); // throws if invalid
  } catch {
    return false;
  }
  return true;
};

// Health check
app.get("/", (_req, res) => {
  res.send("Meme Gallery API is running. Try GET /memes");
});

//Test route to confirm error handling
app.get("/error-test", (_req, _res) => {
  throw new Error("Test error");
});

// GET /memes (required)
app.get("/memes", (_req, res) => {
  res.json(memes);
});

// GET /memes/:id
app.get("/memes/:id", (req, res) => {
  const { id } = req.params;
  const found = memes.find(m => m.id === Number(id));
  if (!found) {
    return res.status(404).json({ error: `The meme with an id of ${id} does not exist` });
  }
  res.json(found);
});

// POST /memes (required) — async-friendly for future DB usage
app.post("/memes", async (req, res) => {
  const { title, url } = req.body ?? {};

  if (!validateMeme({ title, url })) {
    return res.status(400).json({
      error: "title and url are required and must be valid (non-empty; url must be a valid URL)"
    });
  }

  // Use max(id)+1 so IDs remain unique even if list isn’t strictly 1..N
  const nextId = memes.length ? Math.max(...memes.map(m => m.id)) + 1 : 1;
  const newMeme = { id: nextId, title: title.trim(), url: url.trim() };

  memes.push(newMeme);
  console.log(memes); // mirrors teacher's console log
  res.status(201).json(newMeme);
});

// 404 fallback for unknown routes
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Generic error handler )
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Port (env-aware)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Dev Meme API listening at http://localhost:${PORT}`);
});


