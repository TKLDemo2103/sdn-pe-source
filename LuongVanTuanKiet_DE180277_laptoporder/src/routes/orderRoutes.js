const express = require('express');
const router = express.Router();
const { addOrder, addMultipleOrders, getAllOrders, getOrdersByDate } = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, addOrder);
router.get('/', authMiddleware, getAllOrders);

module.exports = router;
