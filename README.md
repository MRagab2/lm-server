# Library Management System — Bosta Assessment

A RESTful API for managing books, borrowers, and borrowing processes built with Node.js, Express, Prisma, and PostgreSQL.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| ORM | Prisma v7 |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (jsonwebtoken) |
| Validation | express-validator |
| Password Hashing | bcryptjs |

---

## Project Structure

```
lm-server/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── src/
│   ├── app.js                # Express app entry point
│   ├── generated/prisma/     # Auto-generated Prisma client
│   ├── middleware/
│   │   └── auth.middleware.js # JWT protection
│   ├── modules/
│   │   ├── auth/             # Register & Login
│   │   ├── books/            # Books CRUD + search
│   │   ├── borrowers/        # Borrowers CRUD
│   │   └── borrowing/        # Checkout, return, overdue
│   └── utils/
│       ├── errors.js         # AppError class
│       ├── prisma.js         # Prisma client instance
│       └── response.js       # sendSuccess / sendError helpers
├── tests/
│   └── borrowing.service.test.js
├── .env.example
├── package.json
└── prisma.config.ts
```

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd lm-server
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Fill in your `.env`:
```env
PORT=3000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
JWT_SECRET="your_secret_key_here"
JWT_EXPIRES_IN="7d"
```

### 4. Run database migrations
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma client
```bash
npx prisma generate
```

### 6. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

---

## Authentication

All protected routes require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Get a token by logging in via `POST /api/auth/login`.

---

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | ❌ |
| POST | `/api/auth/login` | Login and get JWT token | ❌ |

#### POST `/api/auth/register`
```json
// Request body
{
  "name": "Ahmed",
  "email": "ahmed@test.com",
  "password": "123456"
}

// Response 201
{
  "message": "User registered successfully",
  "data": { "id": 1, "name": "Ahmed", "email": "ahmed@test.com" }
}
```

#### POST `/api/auth/login`
```json
// Request body
{
  "email": "ahmed@test.com",
  "password": "123456"
}

// Response 200
{
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": 1, "name": "Ahmed", "email": "ahmed@test.com" }
  }
}
```

---

### Books

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/books` | List all books | ❌ |
| GET | `/api/books/:id` | Get a book by ID | ❌ |
| GET | `/api/books/search?q=` | Search by title, author, or ISBN | ❌ |
| POST | `/api/books` | Add a new book | ✅ |
| PUT | `/api/books/:id` | Update a book | ✅ |
| DELETE | `/api/books/:id` | Soft delete a book | ✅ |

#### POST `/api/books`
```json
// Request body
{
  "title": "Harry Potter",
  "author": "J.K. Rowling",
  "isbn": "978-0439708180",
  "availableQuantity": 5,
  "shelfLocation": "A1"
}

// Response 201
{
  "message": "Book created successfully",
  "data": {
    "id": 1,
    "title": "Harry Potter",
    "author": "J.K. Rowling",
    "isbn": "978-0439708180",
    "availableQuantity": 5,
    "shelfLocation": "A1"
  }
}
```

#### GET `/api/books/search?q=harry`
```json
// Response 200
{
  "message": "Search results retrieved",
  "data": [
    {
      "id": 1,
      "title": "Harry Potter",
      "author": "J.K. Rowling",
      "isbn": "978-0439708180"
    }
  ]
}
```

---

### Borrowers

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/borrowers` | List all borrowers | ❌ |
| GET | `/api/borrowers/:id` | Get a borrower by ID | ❌ |
| POST | `/api/borrowers` | Register a new borrower | ✅ |
| PUT | `/api/borrowers/:id` | Update a borrower | ✅ |
| DELETE | `/api/borrowers/:id` | Soft delete a borrower | ✅ |

#### POST `/api/borrowers`
```json
// Request body
{
  "name": "Mohamed",
  "email": "mohamed@test.com"
}

// Response 201
{
  "message": "Borrower registered successfully",
  "data": {
    "id": 1,
    "name": "Mohamed",
    "email": "mohamed@test.com",
    "registeredDate": "2026-03-15T00:00:00.000Z"
  }
}
```

---

### Borrowing Process

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/borrowing/checkout` | Checkout a book | ✅ |
| PUT | `/api/borrowing/return/:id` | Return a book | ✅ |
| GET | `/api/borrowing/borrower/:borrowerId` | Get borrower's active books | ✅ |
| GET | `/api/borrowing/overdue` | List all overdue books | ✅ |

#### POST `/api/borrowing/checkout`
```json
// Request body
{
  "borrowerId": 1,
  "bookId": 1,
  "dueDate": "2026-04-15"
}

// Response 201
{
  "message": "Book checked out successfully",
  "data": {
    "id": 1,
    "borrowerId": 1,
    "bookId": 1,
    "checkedOutAt": "2026-03-15T00:00:00.000Z",
    "dueDate": "2026-04-15T00:00:00.000Z",
    "returnedAt": null,
    "book": { "title": "Harry Potter" },
    "borrower": { "name": "Mohamed" }
  }
}
```

#### PUT `/api/borrowing/return/:id`
```json
// Response 200
{
  "message": "Book returned successfully",
  "data": {
    "id": 1,
    "returnedAt": "2026-03-15T10:30:00.000Z",
    "book": { "title": "Harry Potter" },
    "borrower": { "name": "Mohamed" }
  }
}
```

#### GET `/api/borrowing/overdue`
```json
// Response 200
{
  "message": "Overdue books retrieved successfully",
  "data": [
    {
      "id": 1,
      "dueDate": "2026-03-01T00:00:00.000Z",
      "returnedAt": null,
      "book": { "title": "Harry Potter" },
      "borrower": { "name": "Mohamed" }
    }
  ]
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description here"
}
```

| Status Code | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid token |
| 404 | Resource not found |
| 409 | Conflict (duplicate email/ISBN) |
| 500 | Internal server error |

---

## Database Schema

```
User
  id, name, email (unique), password, createdAt, updatedAt, deletedAt

Book
  id, title, author, isbn (unique), availableQuantity, shelfLocation,
  createdAt, updatedAt, deletedAt

Borrower
  id, name, email (unique), registeredDate, updatedAt, deletedAt

BorrowingRecord
  id, borrowerId (FK), bookId (FK), checkedOutAt, dueDate,
  returnedAt (nullable), deletedAt
```

---

## Running Tests

```bash
npm test
```

---

## Security

This project implements multiple layers of security to protect against common threats:

### 1. SQL Injection Prevention
Prisma ORM uses **parameterized queries** automatically — user input is never concatenated into SQL strings directly. All database queries are sent as separate parameters, making SQL injection impossible.

```
// Attacker input
email = "ahmed@test.com' OR '1'='1"

// What Prisma sends to PostgreSQL
Query:  SELECT * FROM "User" WHERE email = $1
Params: ["ahmed@test.com' OR '1'='1"]  ← treated as plain text, never executed as SQL
```

### 2. Password Hashing
Passwords are hashed using `bcryptjs` with 10 salt rounds before being stored. Plain text passwords are never saved to the database.

### 3. JWT Authentication
All write endpoints are protected with JWT tokens. Tokens expire after 7 days and are verified on every protected request.

### 4. Input Validation & Sanitization
Every endpoint uses `express-validator` to:
- Validate input types and formats
- Sanitize strings with `.escape()` to prevent XSS attacks
- Strip whitespace with `.trim()`

```
// Attacker input
"<script>alert('hacked')</script>"

// After .escape()
"&lt;script&gt;alert(&#x27;hacked&#x27;)&lt;&#x2F;script&gt;"
```

### 5. Security HTTP Headers (`helmet`)
`helmet` automatically sets 15+ security headers on every response:

| Header | Protects Against |
|---|---|
| `X-Content-Type-Options` | MIME type sniffing |
| `X-Frame-Options` | Clickjacking |
| `Strict-Transport-Security` | Forces HTTPS |
| `Content-Security-Policy` | Script injection |

### 6. Rate Limiting (`express-rate-limit`)
Two layers of rate limiting to prevent abuse and brute force attacks:

| Limiter | Routes | Limit |
|---|---|---|
| General | All routes | 100 requests / 15 min |
| Auth | `/api/auth/login` and `/api/auth/register` | 10 requests / 15 min |

### 7. Request Body Size Limit
Request bodies are limited to `10kb` to prevent large payload / DoS attacks:
```javascript
app.use(express.json({ limit: '10kb' }));
```

### 8. HTTP Parameter Pollution Prevention (`hpp`)
`hpp` prevents attackers from sending duplicate query parameters that could confuse the application:
```
// Without hpp
GET /api/books?q=harry&q=<script> → req.query.q = ["harry", "<script>"]

// With hpp
GET /api/books?q=harry&q=<script> → req.query.q = "harry"
```