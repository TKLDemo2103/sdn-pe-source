const express = require('express');
const router = express.Router();

const bookingsRouter = require('./bookings');
const usersRouter = require('./users');
const ownerRouter = require('./owner');
const adminRouter = require('./admin');

router.use('/bookings', bookingsRouter);
router.use('/users', usersRouter);
router.use('/owner', ownerRouter);
router.use('/admin', adminRouter);

module.exports = router;
