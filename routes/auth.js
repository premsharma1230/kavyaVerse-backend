const express = require("express");
const router = express.Router();
const User = require("../models/models.js");
const bcrypt = require("bcryptjs");

// Sign Up
router.post("/signup", async (req, res) => {
  const { email, password, profession } = req.body;
  if (!email || !password || !profession) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, profession });
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

module.exports = router;
