const Car = require('../models/Car');

// GET /api/v1/cars
exports.getAll = async (req, res, next) => {
  try {
    const { status, type, location } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');

    const cars = await Car.find(filter).populate('ownerId', 'fullName email phone');
    res.json({ success: true, data: cars });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/cars/:id
exports.getById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate('ownerId', 'fullName email phone');
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      error.code = 'CAR_NOT_FOUND';
      return next(error);
    }
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/cars
exports.create = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/cars/:id
exports.update = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/cars/:id
exports.delete = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/cars/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};
