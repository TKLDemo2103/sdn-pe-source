const Rental = require("../models/rentalModel");
const Equipment = require("../models/equipmentModel");

// GET /rentals
exports.getRentals = async (req, res) => {
  try {
    let rentals;
    if (req.user.role === "admin") {
      rentals = await Rental.find()
        .populate("equipmentId")
        .populate("userId", "username role");
    } else {
      rentals = await Rental.find({ userId: req.user.userId })
        .populate("equipmentId")
        .populate("userId", "username role");
    }
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// POST /rentals
exports.createRental = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, quantity } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found." });
    }

    if (equipment.stockQuantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    // Deduct stock
    equipment.stockQuantity -= quantity;
    await equipment.save();

    // Calculate deposit
    const deposit = equipment.depositFee * quantity;

    const rental = new Rental({
      userId: req.user.userId,
      equipmentId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      quantity,
      deposit,
      status: "active",
      rentalDate: new Date(),
    });
    await rental.save();

    res.status(201).json({
      message: "Rental created successfully.",
      rental,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// PATCH /rentals/:id/return
exports.returnRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found." });
    } 

    if (rental.status === "returned") {
      return res.status(400).json({ message: "Rental already returned." });
    }

    // Restore stock
    const equipment = await Equipment.findById(rental.equipmentId);
    equipment.stockQuantity += rental.quantity;
    await equipment.save();

    // Calculate late penalty
    const now = new Date();
    let fineAmount = 0;
    if (now > rental.endDate) {
      const lateDays = Math.ceil((now - rental.endDate) / (1000 * 60 * 60 * 24));
      fineAmount = 0.1 * equipment.pricePerDay * lateDays * rental.quantity;
    }

    rental.status = "returned";
    rental.fineAmount = fineAmount;
    await rental.save();

    res.json({ message: "Equipment returned successfully.", rental });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// GET /rentalsByDate?start=YYYY-MM-DD&end=YYYY-MM-DD
exports.searchByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      return res.status(400).json({ message: "Invalid date range." });
    }

    const rentals = await Rental.find({
      rentalDate: { $gte: startDate, $lte: endDate },
    })
      .populate("equipmentId")
      .populate("userId", "username role");

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};
