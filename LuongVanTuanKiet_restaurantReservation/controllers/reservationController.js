const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");

// GET /reservations
exports.getReservations = async (req, res) => {
  try {
    let reservations;
    if (req.user.role === "admin") {
      reservations = await Reservation.find()
        .populate("tableId")
        .populate("userId", "username role");
    } else {
      reservations = await Reservation.find({ userId: req.user.userId })
        .populate("tableId")
        .populate("userId", "username role");
    }
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// POST /reservations
exports.createReservation = async (req, res) => {
  try {
    const { tableId, startTime, endTime, note } = req.body;

    if (!tableId || !startTime || !endTime) {
      return res.status(400).json({
        message: "tableId, startTime, and endTime are required.",
      });
    }

    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    if (startTimeObj >= endTimeObj) {
      return res.status(400).json({
        message: "startTime must be strictly earlier than endTime.",
      });
    }

    if (startTimeObj < new Date()) {
      return res.status(400).json({
        message: "startTime must not be in the past.",
      });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    if (table.status === "maintenance") {
      return res.status(400).json({
        message:
          "This table is currently unavailable due to maintenance.",
      });
    }

    const conflict = await Reservation.findOne({
      tableId,
      startTime: { $lt: endTimeObj },
      endTime: { $gt: startTimeObj },
    });

    if (conflict) {
      return res.status(409).json({
        message:
          "The selected table is already reserved for the requested time period.",
      });
    }

    const durationHours =
      (endTimeObj - startTimeObj) / (1000 * 60 * 60);
    const totalAmount = durationHours * table.pricePerHour;

    const reservation = new Reservation({
      userId: req.user.userId,
      tableId,
      startTime: startTimeObj,
      endTime: endTimeObj,
      totalAmount,
      note: note || undefined,
    });
    await reservation.save();

    res.status(201).json({
      message: "Reservation created successfully.",
      reservation,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
