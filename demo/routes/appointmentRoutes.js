const express = require("express");
const router = express.Router();
const {
  getAllAppointments,
  bookAppointment,
  completeAppointment,
} = require("../controllers/appointmentController");

router.get("/", getAllAppointments);

router.post("/book", bookAppointment);

router.put("/:id/complete", completeAppointment);

module.exports = router;
