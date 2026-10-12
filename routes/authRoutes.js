// =======================================
// TaskFlow Pro X
// Authentication Routes
// =======================================

const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// =======================================
// Authentication Rate Limiter
// Protects Signup + Login from abuse
// =======================================

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});

// =======================================
// Signup
// =======================================

router.post(
    "/signup",
    authLimiter,
    authController.signup
);

// =======================================
// Login
// =======================================

router.post(
    "/login",
    authLimiter,
    authController.login
);

// =======================================
// Request Email Change OTP
// Requires logged-in user
// =======================================

router.post(
    "/profile/request-email-otp",
    authMiddleware,
    authController.requestEmailOtp
);

// =======================================
// Verify Email Change OTP
// Requires logged-in user
// =======================================

router.post(
    "/profile/verify-email-otp",
    authMiddleware,
    authController.verifyEmailOtp
);

module.exports = router;
