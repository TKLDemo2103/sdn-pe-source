require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const reservationsRoutes = require("./routes/recordRoutes");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/reservations", reservationsRoutes);

app.get("/", (req, res) => {
  res.json({ message: "FPT Library Management System API" });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
