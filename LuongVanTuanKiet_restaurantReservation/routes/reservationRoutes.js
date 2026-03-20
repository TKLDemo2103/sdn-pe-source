const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, reservationController.getReservations);
router.post("/", authenticate, reservationController.createReservation);

module.exports = router;
