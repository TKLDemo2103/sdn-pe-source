require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();
app.use(express.json());

app.use("/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "FPT Hospital Appointment Management System API" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
