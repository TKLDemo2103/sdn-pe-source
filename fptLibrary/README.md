# FPT Library Management System

A RESTful API for managing books, members, and borrow records at FPT University.

## Installation

```bash
cd fptLibrary
npm install
```

## Prerequisites

- Node.js (v18+)
- MongoDB running locally on port 27017

## Running the Application

### 1. Seed the database (creates test accounts and books)

```bash
npm run seed
```

### 2. Start the server

```bash
npm start
```

Server runs at `http://localhost:3000`

## Sample Test Accounts

| Role      | Username    | Password | Description                |
|-----------|-------------|----------|----------------------------|
| Admin     | admin1      | 123456   | Manage all borrow records  |
| Librarian | librarian1  | 123456   | Can borrow & return books  |

## Postman Testing Guide

### 1. Login to get a token

**POST** `http://localhost:3000/auth/login`

Body (JSON):
```json
{
  "username": "librarian1",
  "password": "123456"
}
```

Copy the `token` from the response.

### 2. Set Authorization

For all protected routes, add header:
```
Authorization: Bearer <your_token>
```

### 3. Register a new user

**POST** `http://localhost:3000/auth/register`

Body (JSON):
```json
{
  "username": "newuser",
  "password": "mypassword"
}
```

### 4. Get all borrow records

**GET** `http://localhost:3000/records`

- Admin sees all records
- Librarian sees only their own records

### 5. Borrow a book

**POST** `http://localhost:3000/records/borrow`

Body (JSON):
```json
{
  "bookId": "<book_object_id>",
  "memberName": "Nguyen Van A",
  "borrowDate": "2026-03-09",
  "note": "Optional note"
}
```

> Get book IDs by checking MongoDB after seeding.

### 6. Return a book

**PUT** `http://localhost:3000/records/<record_id>/return`

No body required. Automatically calculates fee based on days borrowed.

## Project Structure

```
fptLibrary/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── recordController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── bookModel.js
│   ├── borrowRecordModel.js
│   └── userModel.js
├── routes/
│   ├── authRoutes.js
│   └── recordRoutes.js
├── .env
├── library.json
├── package.json
├── seed.js
├── server.js
└── README.md
```
