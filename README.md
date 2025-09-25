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


## Screenshots

### GET /memes — list all
<p align="center">
  <img src="screenshots/Memes%20ListAll.png" alt="GET /memes — list all memes" width="800">
</p>

### GET /memes/:id
<p align="center">
  <img src="screenshots/Meme%20Id.png" alt="GET /memes/:id — fetch by id" width="800">
</p>

### POST /memes — create
<p align="center">
  <img src="screenshots/Meme%20Create.png" alt="POST /memes — create meme" width="800">
</p>
