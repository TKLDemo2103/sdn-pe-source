require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const rentalRoutes = require("./routes/rentalRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/rentals", rentalRoutes);

const rentalController = require("./controllers/rentalController");
const authenticate = require("./middleware/authMiddleware");
app.get("/rentalsByDate", authenticate, rentalController.searchByDate);

app.get("/", (req, res) => {
  res.json({ message: "Restaurant Table Reservation Management System API" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
