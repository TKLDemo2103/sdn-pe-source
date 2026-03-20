const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");

// GET /reservations
exports.getReservation = async (req, res) => {
  try {
    let reservations;
    if (req.user.role === "admin") {
      reservations = await Reservation.find()
        .populate("tableId", "tableCode type capacity pricePerHour")
        .populate("userId", "username role");
    } else {
      reservations = await Reservation.find({ userId: req.user.userId })
        .populate("tableId", "tableCode type capacity pricePerHour")
        .populate("userId", "username role");
    }
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// POST /reservations/book
exports.bookReservations = async (req, res) => {
  try {
    const { tableId, startTime, endTime, note } = req.body;

    if (!tableId || !startTime || !endTime) {
      return res.status(400).json({
        message: "tableId, startTime, and endTime are required.",
      });
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    const now = new Date();

    if (startDate < now) {
      return res.status(400).json({
        message: "startTime must not be in the past.",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        message: "endTime must be after startTime.",
      });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    if (table.status === "maintenance") {
      return res.status(400).json({
        message: "This table is under maintenance and cannot be reserved.",
      });
    }

    // Check for overlapping reservations
    const overlapping = await Reservation.findOne({
      tableId,
      endTime: { $gt: startDate },
      startTime: { $lt: endDate },
    });
    if (overlapping) {
      return res.status(409).json({
        message: "This table is already reserved for the requested time.",
      });
    }

    // Calculate total amount
    const diffMs = endDate - startDate;
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    const totalAmount = diffHours * table.pricePerHour;

    const reservation = new Reservation({
      userId: req.user.userId,
      tableId,
      startTime: startDate,
      endTime: endDate,
      totalAmount,
      note: note || undefined,
    });
    await reservation.save();

    res.status(201).json({ message: "Table reserved successfully.", reservation });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
