// Role union
export type Role = "regular" | "admin";

// Category enum to mirror Prisma schema
export enum Category {
  FUNNY = "FUNNY",
  ANIMALS = "ANIMALS",
  GAMING = "GAMING",
  OTHER = "OTHER",
}

export interface User {
  id?: number;
  username: string;
  password: string; // hashed
  role?: Role;
}

export interface Meme {
  id?: number;
  title: string;
  url: string;
  userId?: number;
  // Optional category; Prisma defaults to OTHER if not provided
  category?: Category;
}

export interface Like {
  id?: number;
  userId: number;
  memeId: number;
}
