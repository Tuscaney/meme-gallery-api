// lib/validation.js
import Joi from "joi";

// Meme: title >= 3, url must be a valid URI
export const memeSchema = Joi.object({
  title: Joi.string().min(3).required(),
  url: Joi.string().uri().required(),
});

// Meme (partial) for PUT /memes/:id – allow either field, at least one present
export const memeUpdateSchema = Joi.object({
  title: Joi.string().min(3),
  url: Joi.string().uri(),
}).min(1);

// User: username 3–20 alphanum, password >= 6
export const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required(),
  password: Joi.string().min(6).required(),
});

// Reusable Joi validator middleware
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

