const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// POST /auth/register
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists." });
    }

    const user = new User({ username, password, role: "librarian" });
    await user.save();

    res.status(201).json({
      message: "User registered successfully.",
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// POST /auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
