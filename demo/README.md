# FPT Hospital Appointment Management System

Hospital Appointment Management System for FPT Hospital. Manages doctors, patients, and appointments using Node.js, Express, and MongoDB.

## Installation

```bash
cd yourname_fptHospital
npm install
```

## Running the Application

1. Make sure MongoDB is running locally on port 27017.

2. Seed the database with sample doctors:
```bash
npm run seed
```

3. Start the server:
```bash
npm start
```

Or with auto-reload (development):
```bash
npm run dev
```

Server runs at: `http://localhost:3000`

## Database

- Database name: `hospital` (configured in `.env`)
- Collections: `doctors`, `appointments`

## API Endpoints & Postman Testing Guide

### 1. GET /appointments — Retrieve all appointments

- **Method:** GET
- **URL:** `http://localhost:3000/appointments`
- **Body:** None
- **Expected Response (200):**
```json
[
  {
    "_id": "...",
    "patientId": "...",
    "doctorId": {
      "_id": "...",
      "fullName": "Dr. Nguyen Van A",
      "specialty": "Cardiology",
      "consultationFee": 500000
    },
    "patientName": "Tran Van X",
    "appointmentTime": "2026-04-01T09:00:00.000Z",
    "completedAt": null,
    "totalFee": null,
    "note": "Chest pain"
  }
]
```

### 2. POST /appointments/book — Book a new appointment

- **Method:** POST
- **URL:** `http://localhost:3000/appointments/book`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "doctorId": "<doctor_id_from_seed>",
  "patientName": "Tran Van X",
  "appointmentTime": "2026-04-01T09:00:00.000Z",
  "note": "Chest pain"
}
```
- **Expected Response (201):** The created appointment object.

**Error cases to test:**
- Past appointment time → 400
- Doctor on_leave or retired → 400
- Duplicate time slot → 409

### 3. PUT /appointments/:id/complete — Complete an appointment

- **Method:** PUT
- **URL:** `http://localhost:3000/appointments/<appointment_id>/complete`
- **Body:** None
- **Expected Response (200):**
```json
{
  "_id": "...",
  "completedAt": "2026-03-11T...",
  "totalFee": 500000,
  "..."
}
```

**Error cases to test:**
- Invalid appointment ID → 404
- Already completed → 400

## Project Structure

```
yourname_fptHospital/
├── config/
│   └── db.js
├── controllers/
│   └── appointmentController.js
├── models/
│   ├── doctorModel.js
│   └── appointmentModel.js
├── routes/
│   └── appointmentRoutes.js
├── .env
├── hospital.json
├── package.json
├── seed.js
├── server.js
└── README.md
```
