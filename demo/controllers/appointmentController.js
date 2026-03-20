const mongoose = require("mongoose");
const Appointment = require("../models/appointmentModel");
const Doctor = require("../models/doctorModel");

const HARDCODED_PATIENT_ID = new mongoose.Types.ObjectId();

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate(
      "doctorId",
      "fullName specialty consultationFee"
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { doctorId, patientName, appointmentTime, note } = req.body;

    if (new Date(appointmentTime) < new Date()) {
      return res
        .status(400)
        .json({ message: "Appointment time must not be in the past." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    if (doctor.status === "on_leave" || doctor.status === "retired") {
      return res
        .status(400)
        .json({ message: "This doctor is currently unavailable." });
    }

    const duplicate = await Appointment.findOne({
      doctorId: doctorId,
      appointmentTime: new Date(appointmentTime),
      completedAt: null,
    });
    if (duplicate) {
      return res.status(409).json({
        message:
          "This doctor already has an appointment at the requested time.",
      });
    }

    const newAppointment = new Appointment({
      patientId: HARDCODED_PATIENT_ID,
      doctorId,
      patientName,
      appointmentTime: new Date(appointmentTime),
      note: note || null,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.completedAt) {
      return res
        .status(400)
        .json({ message: "This appointment has already been completed." });
    }

    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    appointment.completedAt = new Date();
    appointment.totalFee = doctor.consultationFee;

    const updatedAppointment = await appointment.save();
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  bookAppointment,
  completeAppointment,
};
