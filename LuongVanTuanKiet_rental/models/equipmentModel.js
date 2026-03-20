const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  depositFee: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("Equipment", equipmentSchema);
