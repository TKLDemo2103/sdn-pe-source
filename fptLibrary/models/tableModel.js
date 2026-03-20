const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableId: { type: String, required: true, unique: true },
  tableCode: { type: String, required: true, unique: true },
  type: {
    type: String,
    required: true,
    enum: ["standard", "vip"],
    default: "standard",
  },
  capacity: { type: Number, required: true },
  pricePerHour: { type: Number, required: true },
  status: {
    type: String,
    enum: ["available", "maintenance"],
    default: "available",
  },
  features: { type: Array, required: true },
});

module.exports = mongoose.model("Table", tableSchema);
