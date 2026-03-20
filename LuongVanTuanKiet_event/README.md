# Event Registration Management System

## Installation

```bash
cd LuongVanTuanKiet_event
npm install
```

## Run

```bash
npm start
```

Server runs at: `http://localhost:3121`

## Sample Test Accounts

| Role    | Username | Password |
|---------|----------|----------|
| Admin   | admin1   | 123456   |
| Student | student1 | 123456   |

> Register these accounts first via `POST /auth/register` before testing.

## Postman Testing Guide

### 1. Register

`POST http://localhost:3121/auth/register`

Body (JSON):
```json
{ "username": "admin1", "password": "123456" }
```

> Note: Default role is "student". To create an admin, manually update the role in MongoDB.

### 2. Login

`POST http://localhost:3121/auth/login`

Body (JSON):
```json
{ "username": "admin1", "password": "123456" }
```

Response returns a `token`. Use it in all protected routes:

```
Authorization: Bearer <token>
```

### 3. Student - Register for Event

`POST http://localhost:3121/registrations`

Headers: `Authorization: Bearer <student_token>`

Body (JSON):
```json
{ "eventId": "<event_id>" }
```

### 4. Student - Cancel Registration

`DELETE http://localhost:3121/registrations/<registrationId>`

Headers: `Authorization: Bearer <student_token>`

### 5. Admin - View All Registrations (Paginated)

`GET http://localhost:3121/listRegistrations?page=1&limit=10`

Headers: `Authorization: Bearer <admin_token>`

### 6. Admin - Search Registrations by Date

`GET http://localhost:3121/getRegistrationsByDate?startDate=2025-01-01&endDate=2025-12-31`

Headers: `Authorization: Bearer <admin_token>`
