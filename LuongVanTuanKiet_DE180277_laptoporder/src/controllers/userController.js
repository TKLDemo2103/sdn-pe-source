const User = require('../models/userModel');
const Order = require('../models/orderModel');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user and their orders
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Xóa tất cả orders của user
    await Order.deleteMany({ userId: userId });

    // Xóa user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User and all associated orders deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, deleteUser };
