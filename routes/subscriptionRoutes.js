const express = require("express");

const router = express.Router();

const subscriptionController = require("../controllers/subscriptionController");
const authMiddleware = require("../middleware/authMiddleware");

// =======================================
// Protect subscription routes with JWT
// =======================================

router.use(authMiddleware);

// =======================================
// GET CURRENT SUBSCRIPTION
// =======================================

router.get(
    "/",
    subscriptionController.getSubscription
);

module.exports = router;
