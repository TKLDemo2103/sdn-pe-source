const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableCode: { type: String, required: true, unique: true },
  type: {
    type: String,
    required: true,
    enum: ["standard", "vip"],
    default: "standard",
  },
  capacity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "maintenance"],
    default: "available",
  },
  pricePerHour: { type: Number, required: true },
  features: { type: [String], default: [] },
});

module.exports = mongoose.model("Table", tableSchema);
