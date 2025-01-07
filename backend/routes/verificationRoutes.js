const express = require("express");
const { sendOtp, verifyOtp } = require("../services/services");
const {
  sendEmailOtp,
  verifyEmailOtp,
} = require("../services/emailVerification");
const router = express.Router();

// Mobile OTP verification
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Email OTP verification
router.post("/email-otp", sendEmailOtp);
router.post("/verify-email", verifyEmailOtp);

module.exports = router;
