require("dotenv").config();
const mongoose = require("mongoose");
const Doctor = require("./models/doctorModel");

const doctors = [
  {
    doctorCode: "DOC001",
    fullName: "Dr. Nguyen Van A",
    specialty: "Cardiology",
    status: "available",
    consultationFee: 500000,
  },
  {
    doctorCode: "DOC002",
    fullName: "Dr. Tran Thi B",
    specialty: "Dermatology",
    status: "available",
    consultationFee: 300000,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected.");

    await Doctor.deleteMany({});
    console.log("Cleared existing doctors.");

    const inserted = await Doctor.insertMany(doctors);
    console.log(`Seeded ${inserted.length} doctors.`);

    await mongoose.connection.close();
    console.log("Done. Connection closed.");
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDB();
