const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Contract = require('../models/Contract');
const User = require('../models/User');

// Calculate rental cost
function calculateRentalCost(startDate, endDate, pricePerDay) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const rentalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return { rentalDays, pricePerDay, totalCost: rentalDays * pricePerDay };
}

// GET /api/v1/bookings
exports.getAll = async (req, res, next) => {
  try {
    const { customerId, carId, status } = req.query;
    const filter = {};
    if (customerId) filter.customerId = customerId;
    if (carId) filter.carId = carId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('customerId', 'fullName email phone')
      .populate('carId', 'brand model licensePlate pricePerDay');
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/bookings/:id
exports.getById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customerId', 'fullName email phone')
      .populate('carId', 'brand model licensePlate pricePerDay location');
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};


// POST /api/v1/bookings
exports.create = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];
    const { carId, startDate, endDate, pickupLocation, returnLocation, notes } = req.body;

    // Get car
    const car = await Car.findById(carId);
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      return next(error);
    }
    if (car.status !== 'AVAILABLE') {
      const error = new Error('Car is not available');
      error.statusCode = 400;
      return next(error);
    }

    // Check conflict
    const conflict = await Booking.findOne({
      carId,
      status: { $nin: ['CANCELLED', 'COMPLETED'] },
      $or: [
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        { $and: [{ startDate: { $lte: new Date(startDate) } }, { endDate: { $gte: new Date(endDate) } }] }
      ]
    });
    if (conflict) {
      const error = new Error('Booking time overlaps');
      error.statusCode = 409;
      error.code = 'BOOKING_CONFLICT';
      return next(error);
    }

    // Calculate price
    const pricing = calculateRentalCost(startDate, endDate, car.pricePerDay);

    // Create booking
    const booking = await Booking.create({
      customerId: userId,
      carId,
      startDate,
      endDate,
      totalDays: pricing.rentalDays,
      pricePerDay: pricing.pricePerDay,
      totalPrice: pricing.totalCost,
      pickupLocation: pickupLocation || car.location,
      returnLocation: returnLocation || car.location,
      notes: notes || ''
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};


// PUT /api/v1/bookings/:id/confirm
exports.confirm = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }
    if (booking.status !== 'PENDING') {
      const error = new Error('Only PENDING bookings can be confirmed');
      error.statusCode = 400;
      return next(error);
    }

    booking.status = 'CONFIRMED';
    await booking.save();

    // Create contract
    const customer = await User.findById(booking.customerId);
    const car = await Car.findById(booking.carId);

    const contract = await Contract.create({
      contractNumber: `CT${Date.now()}`,
      bookingId: booking._id,
      customerId: booking.customerId,
      customerName: customer?.fullName || 'Guest',
      customerPhone: customer?.phone || '',
      customerEmail: customer?.email || '',
      carId: booking.carId,
      carBrand: car?.brand || '',
      carModel: car?.model || '',
      licensePlate: car?.licensePlate || '',
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalDays: booking.totalDays,
      pricePerDay: booking.pricePerDay,
      totalPrice: booking.totalPrice,
      pickupLocation: booking.pickupLocation,
      returnLocation: booking.returnLocation
    });

    res.json({ success: true, data: booking, contract });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/bookings/:id/cancel
exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      const error = new Error('Booking not found');
      error.statusCode = 404;
      return next(error);
    }
    booking.status = 'CANCELLED';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};
