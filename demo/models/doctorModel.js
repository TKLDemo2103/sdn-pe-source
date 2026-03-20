const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  doctorCode: {
    type: String,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "on_leave", "retired"],
    default: "available",
  },
  consultationFee: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
