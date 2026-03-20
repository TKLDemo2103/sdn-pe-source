function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({
      error: {
        message: 'Authentication required. Please provide x-user-id header',
        code: 'UNAUTHORIZED'
      }
    });
  }

  next();
}

module.exports = authMiddleware;
