const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getAllUsers);
router.delete('/:userId', authMiddleware, deleteUser);

module.exports = router;
