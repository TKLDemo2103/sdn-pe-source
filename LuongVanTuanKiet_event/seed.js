require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Event = require("./models/eventModel");
const Registration = require("./models/registrationModel");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});

    // Create users (passwords will be hashed by the pre-save hook)
    const admin = await new User({ username: "admin1", password: "123456", role: "admin" }).save();
    const student1 = await new User({ username: "student1", password: "123456", role: "student" }).save();
    const student2 = await new User({ username: "student2", password: "123456", role: "student" }).save();
    console.log("Users seeded: admin1 (admin), student1 (student), student2 (student)");

    // Create events
    const events = await Event.insertMany([
      { name: "Tech Workshop 2025", description: "Learn about AI and ML", date: new Date("2025-08-15"), location: "Room A101", maxCapacity: 30 },
      { name: "Sports Day", description: "Annual sports competition", date: new Date("2025-09-10"), location: "Stadium", maxCapacity: 100 },
      { name: "Music Festival", description: "Live performances", date: new Date("2025-10-20"), location: "Auditorium", maxCapacity: 50 },
    ]);
    console.log(`Events seeded: ${events.length} events`);

    // Create sample registrations
    await Registration.insertMany([
      { studentId: student1._id.toString(), eventId: events[0]._id.toString(), registrationDate: new Date("2025-07-01") },
      { studentId: student1._id.toString(), eventId: events[1]._id.toString(), registrationDate: new Date("2025-07-05") },
      { studentId: student2._id.toString(), eventId: events[0]._id.toString(), registrationDate: new Date("2025-07-02") },
    ]);
    console.log("Registrations seeded: 3 registrations");

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
}

seed();
