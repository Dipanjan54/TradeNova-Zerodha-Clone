const express = require("express");
const router = express.Router();
const User = require("../model/UserModel");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const { OrdersSchema } = require("../schemas/OrdersSchema");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");
const HoldingsModel = mongoose.model("holding", HoldingsSchema);

// Create Orders Model
const OrdersModel = mongoose.model("order", OrdersSchema);

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

router.get("/signup", (req, res) => {
  res.send("form");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registeredUser = await User.register(newUser, password);

      // Generate JWT token
      const token = jwt.sign(
        { userId: registeredUser._id, username: registeredUser.username },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: registeredUser._id,
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    } catch (e) {
      if (e.name === "UserExistsError") {
        return res.status(400).json({
          success: false,
          message: "A user with the given username is already registered",
        });
      }
      res.status(500).json({
        success: false,
        message: e.message || "Signup failed",
      });
    }
  }),
);

router.post(
  "/login",
  wrapAsync(async (req, res, next) => {
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Request body:", req.body);

    passport.authenticate("local", (err, user, info) => {
      console.log("Passport result:", {
        err,
        user: user ? user.username : null,
        info,
      });

      if (err) {
        console.error("Authentication error:", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      if (!user) {
        console.log("No user found - authentication failed");
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }

      // Generate JWT token instead of session
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      console.log("✅ Login successful for:", user.username);

      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    })(req, res, next);
  }),
);

router.get("/user", verifyToken, async (req, res) => {
  console.log("=== /user ROUTE ===");
  console.log("User ID from token:", req.userId);

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
    });
  }
});

router.post("/logout", (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
