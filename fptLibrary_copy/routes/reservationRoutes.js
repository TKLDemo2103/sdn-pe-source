const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, reservationController.getReservation);
router.post("/book", authenticate, reservationController.bookReservations);

module.exports = router;
