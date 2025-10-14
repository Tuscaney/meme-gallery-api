// routes/authRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

import { validate, userSchema } from "../lib/validation.js";


const prisma = new PrismaClient();
const router = express.Router();

// POST /auth/register  -> create a new user
router.post("/register", async (req, res) => {
  // read input
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  try {
    // hash password (never store plain text)
    const hashed = await bcrypt.hash(password, 10);

    // save user
    const user = await prisma.user.create({
      data: { username, password: hashed },
      select: { id: true, username: true } // do not return password
    });

    // success
    res.status(201).json(user);
  } catch (err) {
    // likely duplicate username (unique constraint)
    return res.status(400).json({ error: "User already exists" });
  }
});

// POST /auth/login  -> return a JWT if credentials are valid
router.post("/login", async (req, res) => {
  // read input
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "username and password required" });

  try {
    // find user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // sign token (use .env secret if set; default fallback for class demos)
    const token = jwt.sign(
      { userId: user.id, role: "regular" },              // token payload
      process.env.JWT_SECRET || "secretkey",             // secret
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }  // expiry
    );

    // return token
    res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;

