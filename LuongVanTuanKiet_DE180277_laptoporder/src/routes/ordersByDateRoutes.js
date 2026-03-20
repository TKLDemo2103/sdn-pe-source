const express = require('express');
const router = express.Router();
const { getOrdersByDate } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getOrdersByDate);

module.exports = router;
