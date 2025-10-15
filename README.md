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

bash
npm install

---

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

### Logger output (console)
![Console request log](screenshots/console-request-log.png)

---

## Update & Delete — Screenshots

### PUT /memes/:id (update)
![PUT — Meme Update](<screenshots/PUT Meme Update.png>)

### GET /memes/:id after delete (should be 404)
![Delete — Meme Id 404](<screenshots/Delete Meme Id.png>)

### GET /memes (verify it’s gone)
![Verified — Meme Delete](<screenshots/Verified Meme Delete.png>)


## Database (AWS RDS PostgreSQL)  10-4-2025 
Week2 Day1

**Tables created**
![Tables](screenshots/DB-tables.png)

**CRUD on RDS (insert → select → update → select → delete → select)**
![CRUD](screenshots/DB-crud.png)

**RDS Connection Info**
![RDS conninfo](screenshots/DB-conninfo.png)


### SQL Queries on AWS RDS
Week2 Day2

Below are the required screenshots from this task:

**Insert seed data (psql)**
_Shows the three INSERTs running successfully._
![Insert seed data — users & memes](screenshots/Insert.png)

**Filter memes by user (user_id = 1)**
_Shows the results of `SELECT * FROM memes WHERE user_id = 1;`_
![SELECT memes by user_id](screenshots/Select.png)

**Join users → memes**
_Shows usernames with their meme titles/urls using an inner JOIN._
![JOIN users and memes](screenshots/Join.png)


## User Memes Endpoint (Prisma)

These confirm the `/users/:id/memes` route.

### ✅ Success: `GET /users/1/memes`
Returns all memes created by user **1**.
![GET /users/1/memes](screenshots/userIDmemes.png)

### ❌ Not Found: `GET /users/999/memes`
Returns `404` when the user does not exist.
![GET /users/999/memes](screenshots/user999memes.png)


## CRUD with Prisma + AWS RDS — Postman Tests

Below are the requests and responses proving full CRUD for `/memes` and error handling.  

### Create (POST /memes)
![POST /memes](screenshots/PostMeme.png)

### Read All (GET /memes)
![GET /memes](screenshots/GetAllMemes.png)

### Read by ID (GET /memes/:id)
![GET /memes/:id](screenshots/MemeByID.png)

### Update (PUT /memes/:id)
![PUT /memes/:id](screenshots/UpdateMeme.png)

### Delete (DELETE /memes/:id)
![DELETE /memes/:id](screenshots/DeleteMeme.png)

### Error Case — Delete Non-existent ID (expects 404)
![DELETE /memes/:id — 404](screenshots/Delete404.png)


## Screenshots — JWT Auth (Postman)

**Register (POST /auth/register)**  
Creates a new user and returns the user object (password is hashed in DB).

![Register](./screenshots/Register.png)

**Login (POST /auth/login)**  
Authenticates with username/password and returns a **JWT** in the `token` field.

![Login](./screenshots/Login.png)

**Create Meme (protected) (POST /memes)**  
Uses **Authorization: Bearer <token>** to create a meme owned by the logged-in user.

![Create Meme (protected)](./screenshots/CreateMeme(protected).png)


## Proof: Like/Unlike + Tests

**POST `/memes/:id/like` — Like**
![Like Meme](./screenshots//LikeMeme.png)

**POST `/memes/:id/like` — Unlike**
![Unlike Meme](./screenshots/UnlikeMeme.png)

**Automated tests (like → unlike + invalid id)**
![Terminal Test](./screenshots/TerminalTest.png)


## Validation (Joi) — Proof

**Memes — Success (201)**
![Meme Success](screenshots/MemeSuccess.png)

**Memes — Failed (400)**
![Meme Failed](screenshots/MemeFailed.png)

**Users — Success (201)**
![Users Success](screenshots/UsersSuccess.png)

**Users — Failed (400)**
![Users Failed](screenshots/UsersFailed.png)