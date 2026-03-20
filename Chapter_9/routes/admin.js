const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/bookings/summary', bookingController.getBookingSummary);

module.exports = router;
