const express = require('express');
const router = express.Router();

const usersRouter = require('./users');
const carsRouter = require('./cars');
const bookingsRouter = require('./bookings');

router.use('/users', usersRouter);
router.use('/cars', carsRouter);
router.use('/bookings', bookingsRouter);

module.exports = router;
