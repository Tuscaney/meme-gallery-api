// index.js 
import express from "express";

const app = express();

// Parse JSON bodies (ES6+)
app.use(express.json());

// In-memory data
let memes = [
  { id: 1, title: "Distracted Boyfriend", url: "https://i.imgur.com/example1.jpg" },
  { id: 2, title: "Success Kid", url: "https://i.imgur.com/example2.jpg" }
];

// Health check
app.get("/", (_req, res) => {
  res.send("Meme Gallery API is running. Try GET /memes");
});

// GET /memes (required)
app.get("/memes", (_req, res) => {
  res.json(memes);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


