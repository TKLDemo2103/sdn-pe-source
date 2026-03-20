const express = require("express");
const router = express.Router();
const recordController = require("../controllers/reservationController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, recordController.getRecords);
router.post("/borrow", authenticate, recordController.borrowBook);
router.put("/:id/return", authenticate, recordController.returnBook);

module.exports = router;
