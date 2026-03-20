const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/auth');

router.get('/bookings', authMiddleware, bookingController.getOwnerBookings);

module.exports = router;
