require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/registrations", registrationRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Registration Management System API" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
