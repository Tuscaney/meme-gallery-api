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

### GET /memes (list all)
![Memes — List All](<screenshots/Memes ListAll.png>)

### GET /memes/:id (generic)
![Meme — Id (generic)](<screenshots/Meme Id.png>)

### GET /memes/:id (success: id=1)
![Meme — ID 1](<screenshots/Meme 1.png>)

### GET /memes/:id (404: id=9999)
![Meme — ID 9999 (404)](<screenshots/Meme 9999.png>)

### POST /memes (create)
![Meme — Create](<screenshots/Meme Create.png>)

### /error-test (500)
![Error Test — 500](<screenshots/Meme error test.png>)
