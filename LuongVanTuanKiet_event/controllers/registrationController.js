const Registration = require("../models/registrationModel");
const Event = require("../models/eventModel");

// POST /registrations - Student registers for an event
exports.createRegistration = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user.userId;

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required." });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if student already registered for this event
    const existing = await Registration.findOne({ studentId, eventId });
    if (existing) {
      return res
        .status(409)
        .json({ message: "You have already registered for this event." });
    }

    // Check if event has reached max capacity
    const currentCount = await Registration.countDocuments({ eventId });
    if (currentCount >= event.maxCapacity) {
      return res
        .status(400)
        .json({ message: "Event has reached maximum capacity." });
    }

    const registration = new Registration({
      studentId,
      eventId,
      registrationDate: new Date(),
    });
    await registration.save();

    res.status(201).json({
      message: "Registration successful.",
      registration,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// DELETE /registrations/:registrationId
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found." });
    }

    // Ensure the student can only cancel their own registration
    if (registration.studentId !== req.user.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own registration." });
    }

    await Registration.findByIdAndDelete(req.params.registrationId);
    res.json({ message: "Registration cancelled successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET /getRegistrationsByDate - Admin searches registrations by date range
exports.getRegistrationsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate query parameters are required.",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    if (start >= end) {
      return res
        .status(400)
        .json({ message: "startDate must be earlier than endDate." });
    }

    const registrations = await Registration.find({
      registrationDate: { $gte: start, $lte: end },
    }).sort({ registrationDate: -1 });

    if (registrations.length === 0) {
      return res
        .status(200)
        .json({ message: "No registrations found in this date range." });
    }

    res.json({ total: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

exports.getAllRegistrations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Registration.countDocuments();
    if (total === 0) {
      return res.status(200).json({ message: "No registrations found." });
    }

    const registrations = await Registration.find()
      .skip(skip)
      .limit(limit)
      .sort({ registrationDate: -1 });

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
