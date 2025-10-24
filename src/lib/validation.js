import Joi from "joi";

// Allowed categories (must match Prisma enum & TS enum)
const categoryEnum = ["FUNNY", "ANIMALS", "GAMING", "OTHER"];

// Meme: title >= 3, url must be a valid URI, optional category
export const memeSchema = Joi.object({
  title: Joi.string().min(3).required(),
  url: Joi.string().uri().required(),
  category: Joi.string().valid(...categoryEnum).optional(),
});

// Meme (partial) for PUT /memes/:id – allow either field, at least one present
export const memeUpdateSchema = Joi.object({
  title: Joi.string().min(3).optional(),
  url: Joi.string().uri().optional(),
  category: Joi.string().valid(...categoryEnum).optional(),
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


