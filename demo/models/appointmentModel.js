const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  totalFee: {
    type: Number,
    default: null,
  },
  note: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
