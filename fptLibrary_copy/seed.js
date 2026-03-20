require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Table = require("./models/tableModel");
const libraryData = require("./library.json");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await User.deleteMany({});
    await Table.deleteMany({});

    // Seed users
    const admin = new User({
      username: "admin1",
      password: "123456",
      role: "admin",
    });
    const customer = new User({
      username: "customer1",
      password: "123456",
      role: "customer",
    });
    await admin.save();
    await customer.save();
    console.log("Users seeded: admin1, customer1");

    await Table.insertMany(libraryData);
    console.log(`Tables seeded: ${libraryData.length} tables`);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
}

seed();
