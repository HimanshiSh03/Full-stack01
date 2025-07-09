const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model"); // Ensure this path is correct
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Render Register Page (Frontend handles rendering, these might not be needed if it's a pure API backend)
router.get("/register", (req, res) => {
  res.render("register"); // This assumes you have EJS setup and actual EJS files
});

// Register Handler
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Registration error:", err.message); // Added console.error for server logs
    res.status(500).json({ error: "Internal server error" });
  }
});

// Render Login Page (Frontend handles rendering, these might not be needed if it's a pure API backend)
router.get("/login", (req, res) => {
  res.render("login"); // This assumes you have EJS setup and actual EJS files
});

// Login Handler
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set token as cookie (can be accessed by frontend)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
      sameSite: "Lax", // Or 'None' if cross-site and secure is true
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;