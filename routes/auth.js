const express = require("express");
const router = express.Router();
const User = require("../models/models.js");
const bcrypt = require("bcryptjs");
// const User = mongoose.model("User");
const twilio = require("twilio");
const PhoneVerification = require("../models/phoneVerification.js");
// const mongoose = require("mongoose");

// Twilio configuration
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const twilioPhoneNumber = "+13614281479";
// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password, profession, phone } = req.body;
  if (!email || !password || !profession || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with email or phone already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      profession,
      phone,
    });
    await user.save();
    res.status(201).json({ message: "Sign up successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password, profession } = req.body;
  if (!email || !password || !profession) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email, profession });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Phone verification routes

router.post("/login-with-phone", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  try {
    const countryCode = "+91"; // Add the country code to the phone number
    const phoneNumber = countryCode + phone;
    const existingPhoneVerification = await PhoneVerification.findOne({
      phone: phoneNumber,
    });
    let otp;
    if (existingPhoneVerification) {
      // If phone verification already exists, update it with a new OTP
      existingPhoneVerification.otp = Math.floor(
        100000 + Math.random() * 900000
      );
      otp = existingPhoneVerification.otp;
      await existingPhoneVerification.save();
    } else {
      // If phone verification does not exist, create a new one
      otp = Math.floor(100000 + Math.random() * 900000);
      const phoneVerification = new PhoneVerification({
        phone: phoneNumber,
        otp,
      });
      await phoneVerification.save();
    }
    client.messages
      .create({
        from: twilioPhoneNumber,
        to: "+91" + phone,
        body: `Your OTP is: ${otp}`,
      })
      .then(message => {
        console.log(message.sid);
        res.status(200).json({ message: "OTP sent to your phone number" });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Server error" });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required" });
  }
  try {
    const countryCode = "+91"; // Update country code to India
    const phoneNumber = countryCode + phone;
    const phoneVerification = await PhoneVerification.findOne({
      phone: phoneNumber,
    });
    if (!phoneVerification) {
      return res.status(404).json({ message: "Phone verification not found" });
    }
    if (
      phoneVerification &&
      phoneVerification.otp &&
      phoneVerification.otp !== otp
    ) {
      return res.status(401).json({ message: "Invalid OTP" });
    }
    // Login successful, return user data
    const user = await User.findOne({ phone: phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
