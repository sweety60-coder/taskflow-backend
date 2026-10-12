const express = require("express");

const router = express.Router();

const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

// =======================================
// GET PROFILE
// =======================================

router.get(
"/",
authMiddleware,
profileController.getProfile
);

// =======================================
// UPDATE PROFILE
// =======================================

router.put(
"/",
authMiddleware,
profileController.updateProfile
);

module.exports = router;
