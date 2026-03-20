const User = require("../models/userModel");
const Reservation = require("../models/rentalModel");

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    let users;
    if (req.user.role === "admin") {
      users = await User.find().select("-password");
    } else {
      users = await User.find({ _id: req.user.userId }).select("-password");
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const activeReservations = await Reservation.find({
      userId: req.params.id,
      endTime: { $gt: new Date() },
    });

    if (activeReservations.length > 0) {
      return res.status(400).json({ message: "Cannot delete users with active rentals." });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
