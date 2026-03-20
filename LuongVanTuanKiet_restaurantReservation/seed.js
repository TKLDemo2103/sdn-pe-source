require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Table = require("./models/tableModel");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    await User.deleteMany({});
    await Table.deleteMany({});

    const admin = new User({
      username: "admin1",
      password: "123456",
      role: "admin",
    });
    const customer = new User({
      username: "user1",
      password: "123456",
      role: "customer",
    });
    await admin.save();
    await customer.save();
    console.log("Users seeded: admin1 (admin), user1 (customer)");

    const tables = [
      {
        tableCode: "T-01",
        type: "standard",
        capacity: 4,
        status: "available",
        pricePerHour: 100000,
        features: ["windowView"],
      },
      {
        tableCode: "T-02",
        type: "standard",
        capacity: 2,
        status: "available",
        pricePerHour: 80000,
        features: ["outdoor"],
      },
      {
        tableCode: "T-03",
        type: "standard",
        capacity: 4,
        status: "maintenance",
        pricePerHour: 100000,
        features: ["air-conditioner"],
      },
      {
        tableCode: "VIP-01",
        type: "vip",
        capacity: 8,
        status: "available",
        pricePerHour: 300000,
        features: ["privateRoom", "windowView", "air-conditioner"],
      },
      {
        tableCode: "VIP-02",
        type: "vip",
        capacity: 6,
        status: "available",
        pricePerHour: 250000,
        features: ["privateRoom", "air-conditioner"],
      },
      {
        tableCode: "VIP-03",
        type: "vip",
        capacity: 6,
        status: "available",
        pricePerHour: 200000,
        features: ["windowView", "privateRoom", "air-conditioner"],
      },
    ];

    await Table.insertMany(tables);
    console.log(`Tables seeded: ${tables.length} tables`);

    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
}

seed();
