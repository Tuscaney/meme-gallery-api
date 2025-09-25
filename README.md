# Meme Gallery API

A tiny Express API (ES Modules) that demonstrates **GET /memes**, **GET /memes/:id**, and **POST /memes** with small, readable middleware and validation. Perfect for practicing routes, async handlers, and basic HTTP testing with curl/Postman.

---

## Features

- Node.js + Express with **ES Modules** (`"type": "module"`)
- In-memory data store (resets on restart)
- Routes:
  - `GET /` – health check
  - `GET /memes` – list all memes
  - `GET /memes/:id` – fetch a single meme by id
  - `POST /memes` – create a meme (async-friendly)
- Middleware:
  - JSON body parsing
  - Malformed JSON handling (returns 400)
  - Simple request logger
  - 404 fallback + generic error handler
- Stricter input validation (non-empty strings + URL parsing)

---

## Requirements

- Node.js (LTS recommended)
- npm

---

## Setup

```bash
npm install

## Postman Screenshots
<img width="1146" height="623" alt="Memes ListAll" src="https://github.com/user-attachments/assets/90129c30-c76c-43cd-954c-b68885747b54" />
<img width="1168" height="617" alt="Meme Id" src="https://github.com/user-attachments/assets/5dba295d-2b05-48e2-a543-73a7f309296f" />
<img width="1172" height="607" alt="Meme Create" src="https://github.com/user-attachments/assets/c5bc46ef-5d61-4f55-90e2-dd2adfdfda0f" />




