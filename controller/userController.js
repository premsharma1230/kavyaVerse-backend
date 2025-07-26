const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const twilio = require("twilio");

// Twilio configuration

const client = new twilio(accountSid, authToken);

// Generate OTP and send it to the user's phone number
router.post("/login", (req, res) => {
  const phoneNumber = req.body.phone;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
  const user = new User({ phone: phoneNumber, otp: otp.toString() });
  user.save(err => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error generating OTP" });
    } else {
      // Send the OTP to the user's phone number using Twilio
      client.messages
        .create({
          from: "your_twilio_phone_number",
          to: phoneNumber,
          body: `Your OTP is: ${otp}`,
        })
        .then(message => {
          console.log(message.sid);
          res.send({ message: "OTP sent successfully" });
        })
        .done();
    }
  });
});

// Verify the OTP
router.post("/verify-otp", (req, res) => {
  const phoneNumber = req.body.phone;
  const otp = req.body.otp;
  User.findOne({ phone: phoneNumber }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: "Error verifying OTP" });
    } else if (!user) {
      res.status(404).send({ message: "User not found" });
    } else if (user.otp !== otp) {
      res.status(401).send({ message: "Invalid OTP" });
    } else {
      // Authenticate the user
      res.send({ message: "Login successful" });
    }
  });
});
