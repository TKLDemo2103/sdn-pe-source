function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.code || 'ERROR'}: ${err.message}`);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: {
        message: messages.join(', '),
        code: 'VALIDATION_ERROR'
      }
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: {
        message: 'Invalid ID format',
        code: 'INVALID_ID'
      }
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: {
        message: 'Duplicate entry',
        code: 'DUPLICATE_ERROR'
      }
    });
  }

  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: { message, code }
  });
}

module.exports = errorHandler;
