const mongoose = require("mongoose");

const rentalScheme = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  equipmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipment",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  quantity: { type: Number, default: 0 },
  deposit: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "returned", "cancelled"], default: "active" },
  rentalDate: { type: Date, default: Date.now },
  fineAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Rental", rentalScheme);
