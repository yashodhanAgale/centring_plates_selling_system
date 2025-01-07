const axios = require("axios");
const moment = require("moment");

// In-memory OTP store
let otpStore = {}; // Key: phoneNumber, Value: { otp, expiresAt }

// Constants
const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes

// Utility function to normalize phone numbers
const normalizePhoneNumber = (phoneNumber) => phoneNumber.replace(/\D/g, "");

// Generate and send OTP
exports.sendOtp = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP
  const expiresAt = moment().add(5, "minutes").toISOString(); // Expiry time

  // Save OTP in memory
  otpStore[normalizedPhoneNumber] = { otp, expiresAt };
  console.log("Stored OTP for phoneNumber:", normalizedPhoneNumber, otp);
  console.log("All OTPs in otpStore:", otpStore);
  try {
    // Send OTP using MSG91
    await axios.post("https://control.msg91.com/api/v5/flow/", {
      authkey: "332159AeEpfWkj7GC5ee22927P1",
      mobiles: normalizedPhoneNumber.startsWith("91")
        ? normalizedPhoneNumber
        : "91" + normalizedPhoneNumber,
      var: otp,
      template_id: "6618fc1bd6fc0558e7681454",
    });

    return res.status(200).json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP." });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { phoneNumber, enteredOtp } = req.body;

  if (!phoneNumber || !enteredOtp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required." });
  }

  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);

  // Retrieve OTP from in-memory store
  const otpData = otpStore[normalizedPhoneNumber];

  if (!otpData) {
    return res
      .status(400)
      .json({ message: "OTP not found. Please request a new OTP." });
  }

  const { otp, expiresAt } = otpData;

  // Check if OTP has expired
  if (moment().isAfter(moment(expiresAt))) {
    delete otpStore[normalizedPhoneNumber]; // Remove expired OTP
    return res
      .status(400)
      .json({ message: "OTP expired. Please request a new OTP." });
  }

  // Validate OTP
  if (parseInt(enteredOtp) !== otp) {
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  // OTP is valid; delete it from memory
  delete otpStore[normalizedPhoneNumber];

  return res
    .status(200)
    .json({ success: true, message: "OTP verified successfully." });
};
