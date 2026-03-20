# Restaurant Table Reservation Management System

A Node.js + Express + MongoDB REST API for managing restaurant table reservations with JWT authentication and role-based access control.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reservation
JWT_SECRET=fpt_library_secret_key_2024
```

## Running the Application

### 1. Seed the database (creates sample users and tables)

```bash
npm run seed
```

### 2. Start the server

```bash
npm start
```

The server will run at `http://localhost:3000`.

## Sample Test Accounts

| Role     | Username | Password | Description                                |
| -------- | -------- | -------- | ------------------------------------------ |
| Admin    | admin1   | 123456   | Can manage tables and all reservations     |
| Customer | user1    | 123456   | Can create a new reservation for a specific table |

## API Endpoints

### Authentication

#### POST /auth/register

Register a new user (default role: customer).

**Body:**
```json
{
  "username": "newuser",
  "password": "mypassword"
}
```

#### POST /auth/login

Login and receive a JWT token.

**Body:**
```json
{
  "username": "admin1",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login successful.",
  "token": "<JWT_TOKEN>"
}
```

### Reservations (Requires Bearer Token)

Set the `Authorization` header to `Bearer <JWT_TOKEN>` for all reservation endpoints.

#### GET /reservations

Retrieve reservations.

- Admin: returns all reservations.
- Customer: returns only their own reservations.

#### POST /reservations

Create a new reservation.

**Body:**
```json
{
  "tableId": "<TABLE_OBJECT_ID>",
  "startTime": "2026-05-10T18:00:00.000Z",
  "endTime": "2026-05-10T20:00:00.000Z",
  "note": "Birthday dinner, need cake service"
}
```

**Validation rules:**
- `startTime` must be earlier than `endTime`
- `startTime` must not be in the past
- Table must not be under maintenance
- No overlapping reservations for the same table
- `totalAmount` is auto-calculated from `pricePerHour × duration in hours`

## Postman Testing Guide

1. Run `npm run seed` to populate the database.
2. Start the server with `npm start`.
3. Use **POST /auth/login** with `admin1`/`123456` or `user1`/`123456` to get a token.
4. Copy the token from the response.
5. For reservation endpoints, add an `Authorization` header with value `Bearer <token>`.
6. Use **GET /reservations** to list reservations.
7. Use **POST /reservations** with a valid `tableId` (from the seeded tables) to create a reservation.

## Project Structure

```
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── reservationController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── userModel.js
│   ├── tableModel.js
│   └── reservationModel.js
├── routes/
│   ├── authRoutes.js
│   └── reservationRoutes.js
├── .env
├── seed.js
├── server.js
└── package.json
```
