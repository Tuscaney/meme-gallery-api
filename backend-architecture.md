# Backend Architecture Plan – Meme Gallery

## Overview
Extend the existing Express + Prisma + PostgreSQL (AWS RDS) API with authentication, roles, and likes. Use JWT for stateless auth, bcrypt for password hashing, and Prisma relations for users ↔ memes ↔ likes.

## Planned Routes

### Auth
- `POST /auth/register` → create user (username, password). Hash password, default role = USER. **201** → `{ id, username }`
- `POST /auth/login` → verify credentials, return JWT `{ token, user: { id, username, role } }`

### Memes
- `GET /memes` → public list (include author username)
- `GET /memes/:id` → public detail
- `POST /memes` → **protected**; create meme owned by the authenticated user
- `PUT /memes/:id` → **protected**; owner or admin may update
- `DELETE /memes/:id` → **protected**; owner or admin may delete

### Likes
- `POST /memes/:id/like` → **protected**; toggle like (like if not liked; unlike if already liked)

### Users
- `GET /users/:id/memes` → public list of a user’s memes (already implemented)

## Data Models (Prisma)
## Data Models (Prisma)
```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id       Int             @id @default(autoincrement())
  username String          @unique
  password String          // bcrypt hash
  role     Role            @default(USER)
  memes    Meme[]
  likes    UserLikesMeme[]
}

model Meme {
  id      Int             @id @default(autoincrement())
  title   String
  url     String
  user    User            @relation(fields: [userId], references: [id])
  userId  Int
  likedBy UserLikesMeme[]
}

model UserLikesMeme {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int
  meme   Meme @relation(fields: [memeId], references: [id])
  memeId Int

  @@unique([userId, memeId]) // one like per user per meme
}
```


## Authentication Flow
1. **Register**: client sends `{ username, password }`. Server hashes the password (bcrypt) and creates the user with `role = USER`.
2. **Login**: server verifies credentials and returns a JWT with payload `{ userId, role }`.
3. **Protected routes**: require `Authorization: Bearer <token>`. Middleware verifies the token and attaches `req.user = { userId, role }`.

## Authorization Rules
- Create meme: authenticated users only
- Update/Delete meme: owner OR admin
- Like/Unlike: authenticated users only
- (Optional admin): can delete any meme or user

## Middleware Plan
- `authenticateJWT` → verifies token, sets `req.user`
- `requireOwnerOrAdmin` → checks `req.user.id === resource.userId || req.user.role === 'ADMIN'`
- `requireRole('ADMIN')` (optional helper)

## Error & Security Notes
- Consistent JSON errors: `{ "error": "message" }` with proper status (400/401/403/404/409/500)
- Never return password hashes
- Keep `JWT_SECRET` and DB URL in `.env` (not committed)
- RDS: keep `sslmode=require` in `DATABASE_URL`
- (Future) add rate limiting & CORS config

## Relationship Diagram (ASCII)
User (1) ──< Meme (many)
   \                     ^
    \                   /
     \> UserLikesMeme </
          (join)
