const Order = require("../models/orderModel");
const Laptop = require("../models/laptopModel");

// Add new order
const addOrder = async (req, res) => {
  try {
    const { laptopId, quantity } = req.body;
    const userId = req.userId;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive integer" });
    }

    const laptop = await Laptop.findById(laptopId);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop not found" });
    }

    if (laptop.stockQuantity < quantity) {
      return res.status(400).json({ message: "Laptop not available for you" });
    }

    laptop.stockQuantity -= quantity;
    await laptop.save();

    const order = new Order({
      userId,
      laptopId,
      quantity,
      orderDate: new Date(),
    });
    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "-password")
      .populate("laptopId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search orders by date range
const getOrdersByDate = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      orderDate: { $gte: startDate, $lte: endDate },
    })
      .populate("userId", "-password")
      .populate("laptopId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add multiple orders
const addMultipleOrders = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required" });
    }

    const orders = [];
    const errors = [];

    for (const item of items) {
      const { laptopId, quantity } = item;

      const laptop = await Laptop.findById(laptopId);
      if (!laptop) {
        errors.push({ laptopId, message: "Laptop not found" });
        continue;
      }

      if (laptop.stockQuantity < quantity) {
        errors.push({ laptopId, message: "Insufficient stock" });
        continue;
      }

      laptop.stockQuantity -= quantity;
      await laptop.save();

      const order = new Order({
        userId,
        laptopId,
        quantity,
        orderDate: new Date(),
      });
      await order.save();
      orders.push(order);
    }

    res.status(201).json({ orders, errors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrder, addMultipleOrders, getAllOrders, getOrdersByDate };
