function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.code || 'ERROR'}: ${err.message}`);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: {
        message: messages.join(', '),
        code: 'VALIDATION_ERROR'
      }
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        message: 'Invalid ID format',
        code: 'INVALID_ID'
      }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'Duplicate entry',
        code: 'DUPLICATE_ERROR'
      }
    });
  }

  // Custom error
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: { message, code }
  });
}

module.exports = errorHandler;
