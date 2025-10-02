// index.js
import express from "express";
import memeRoutes from "./routes/memeRoutes.js";

const app = express();
app.use(express.json());

app.use("/memes", memeRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



