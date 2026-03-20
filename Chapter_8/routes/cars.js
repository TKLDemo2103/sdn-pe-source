const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.get('/', carController.getAll);
router.get('/:id', carController.getById);
router.post('/', carController.create);
router.put('/:id', carController.update);
router.delete('/:id', carController.delete);
router.put('/:id/status', carController.updateStatus);

module.exports = router;
