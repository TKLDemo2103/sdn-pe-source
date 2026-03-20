require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Book = require("./models/bookModel");
const libraryData = require("./library.json");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await User.deleteMany({});
    await Book.deleteMany({});

    // Seed users
    const admin = new User({
      username: "admin1",
      password: "123456",
      role: "admin",
    });
    const librarian = new User({
      username: "librarian1",
      password: "123456",
      role: "librarian",
    });
    await admin.save();
    await librarian.save();
    console.log("Users seeded: admin1, librarian1");

    await Book.insertMany(libraryData);
    console.log(`Books seeded: ${libraryData.length} books`);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
}

seed();
