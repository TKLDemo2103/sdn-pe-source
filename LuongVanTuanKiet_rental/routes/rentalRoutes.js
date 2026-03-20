const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, rentalController.getRentals);
router.post("/", authenticate, rentalController.createRental);
router.patch("/:id/return", authenticate, rentalController.returnRental);

module.exports = router;
