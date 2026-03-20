require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ordersByDateRoutes = require("./routes/ordersByDateRoutes");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/ordersByDate", ordersByDateRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Laptop Order Management API" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
