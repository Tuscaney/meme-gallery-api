import "express";
import type { Role } from "./index.js";

declare global {
  namespace Express {
    // What auth middleware puts on req.user
    interface UserPayload {
      userId: number;
      role?: Role;
      scope?: string[];
      scopes?: string[]; // some tokens might use 'scopes'
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

// This file is an ambient declaration module
export {};
