
const mongoose = require("mongoose");

const phoneVerificationSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  otp: { type: String },
});

module.exports = mongoose.model("phoneVerification", phoneVerificationSchema);
