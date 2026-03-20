const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Student: register for an event
router.post(
  "/",
  authenticate,
  authorize("student"),
  registrationController.createRegistration,
);

// Student: cancel registration by registrationId
router.delete(
  "/:registrationId",
  authenticate,
  authorize("student"),
  registrationController.cancelRegistration,
);
router.get(
  "/listRegistrations",
  authenticate,
  authorize("admin"),
  registrationController.getAllRegistrations,
);
router.get(
  "/getRegistrationsByDate",
  authenticate,
  authorize("admin"),
  registrationController.getRegistrationsByDate,
);
module.exports = router;
