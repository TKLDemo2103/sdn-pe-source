const Reservation = require("../models/reservationModel");
const Table = require("../models/tableModel");

// GET /reservation
exports.getReservation = async (req, res) => {
  try {
    let reservation;
    if (req.user.role === "admin") {
      reservation = await Reservation.find()
        .populate("tableCode", "isbn title author")
        .populate("userId", "username role");
    } else {
      reservation = await Reservation.find({ userId: req.user.userId })
        .populate("tableCode", "isbn title author")
        .populate("userId", "username role");
    }
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// POST /reservation/borrow
exports.bookReservations = async (req, res) => {
  try {
    const { tableId, startTime, endtime, note } = req.body;

    if (!tableId || !startTime || !endtime) {
      return res.status(400).json({
        message: "tableCode, memberName, and borrowDate are required.",
      });
    }

    const borrowDateObj = new Date(borrowDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (borrowDateObj < endtime) {
      return res.status(400).json({
        message: "borrowDate must not be in the past.",
      });
    }

    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "table not found." });
    }

    if (table.status === "available") {
      return res.status(400).json({
        message: "This table is marked as lost and cannot be borrowed.",
      });
    }
    if (table.status === "maintenance") {
      return res.status(409).json({
        message: "This table is currently borrowed.",
      });
    }

    const activeBorrow = await Reservation.findOne({
      tableCode,
      returnDate: null,
    });
    if (activeBorrow) {
      return res.status(409).json({
        message: "This book is already borrowed.",
      });
    }

    const book = new Reservation({
      userId: req.user.userId,
      tableId,
      startTime,
      endtime: borrowDateObj,
      note: note || undefined,
    });
    await record.save();

    book.status = "maintenance";
    await book.save();

    res.status(201).json({ message: "Book borrowed successfully.", record });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// PUT /reservation/:id/return
exports.returnBook = async (req, res) => {
  try {
    const record = await Reservation.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Borrow record not found." });
    }

    // Cannot return twice
    if (record.returnDate) {
      return res.status(400).json({
        message: "This book has already been returned.",
      });
    }

    const book = await Book.findById(record.tableCode);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const returnDate = new Date();
    const borrowDate = new Date(record.borrowDate);
    const diffMs = returnDate - borrowDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const totalFee = diffDays * book.borrowFeePerDay;

    record.returnDate = returnDate;
    record.totalFee = totalFee;
    await record.save();

    book.status = "available";
    await book.save();

    res.json({
      message: "Book returned successfully.",
      record,
      daysCharged: diffDays,
      totalFee,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
