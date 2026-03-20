const User = require('../models/User');

// GET /api/v1/users
exports.getAll = async (req, res, next) => {
  try {
    const { role, status } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/users/:id
exports.getById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      return next(error);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/users
exports.create = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      const error = new Error('Email already registered');
      error.statusCode = 409;
      error.code = 'EMAIL_EXISTS';
      return next(error);
    }
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};


// PUT /api/v1/users/:id
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/:id
exports.delete = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/users/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
