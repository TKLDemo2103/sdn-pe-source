const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/auth');

router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.post('/', authMiddleware, bookingController.create);
router.put('/:id/confirm', bookingController.confirm);
router.put('/:id/cancel', bookingController.cancel);

module.exports = router;
