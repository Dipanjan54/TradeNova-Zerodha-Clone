const express = require("express");
const router = express.Router();
const User = require("../model/UserModel");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const mongoose = require("mongoose");
const { OrdersSchema } = require("../schemas/OrdersSchema");
const { HoldingsSchema } = require("../schemas/HoldingsSchema");
const HoldingsModel = mongoose.model("holding", HoldingsSchema);
// Create Orders Model
const OrdersModel = mongoose.model("order", OrdersSchema);

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }
  next();
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

      // Auto login after signup
      req.login(registeredUser, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Signup successful but login failed",
          });
        }

        req.flash("success", "Welcome to Zerodha!");
        res.status(201).json({
          success: true,
          message: "User registered and logged in successfully",
          user: {
            id: registeredUser._id,
            username: registeredUser.username,
            email: registeredUser.email,
          },
        });
      });
    } catch (error) {
      if (error.code === 11000) {
        req.flash(
          "error",
          "Email already exists. Please use a different email.",
        );
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }
      if (error.name === "UserExistsError") {
        req.flash(
          "error",
          "Username already exists. Please choose a different username.",
        );
        return res.status(400).json({
          success: false,
          message: "Username already exists",
        });
      }
      req.flash("error", error.message);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),
);

router.post(
  "/login",
  wrapAsync(async (req, res, next) => {
    console.log("=== LOGIN ATTEMPT ===");
    console.log("Request body:", req.body);
    console.log("Session ID:", req.sessionID);

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
        req.flash("error", "Invalid username or password");
        return res.status(401).json({
          success: false,
          message: "Invalid username or password",
        });
      }
      req.login(user, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.status(500).json({
            success: false,
            message: "Login failed",
          });
        }
        console.log("✅ Login successful for:", user.username);
        console.log("Session after login:", req.sessionID);
        req.flash("success", "Welcome back!");
        res.status(200).json({
          success: true,
          message: "Login successful",
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
          },
        });
      });
    })(req, res, next);
  }),
);

router.get("/user", (req, res) => {
  console.log("=== /user ROUTE ===");
  console.log("Session ID:", req.sessionID);
  console.log("Is authenticated:", req.isAuthenticated());
  console.log("User:", req.user);

  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
  }

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
    req.flash("success", "Logged out successfully");
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

// ============================================
// ORDERS ROUTES - Only for logged-in users
// ============================================

// Get all orders for the logged-in user ONLY
router.get(
  "/allOrders",
  isAuthenticated,
  wrapAsync(async (req, res) => {
    console.log("Fetching orders for user:", req.user._id);

    const userOrders = await OrdersModel.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    console.log("Found orders:", userOrders.length);
    res.status(200).json(userOrders);
  }),
);

// Create new order for the logged-in user
router.post(
  "/newOrder",
  isAuthenticated,
  wrapAsync(async (req, res) => {
    const { name, qty, price, mode } = req.body;

    console.log("Creating order for user:", req.user._id);

    // Create the order
    const newOrder = new OrdersModel({
      name,
      qty,
      price,
      mode,
      user: req.user._id,
    });

    await newOrder.save();
    console.log("Order created:", newOrder);

    // Update Holdings based on mode
    if (mode === "BUY") {
      // Check if user already owns this stock
      let holding = await HoldingsModel.findOne({
        user: req.user._id,
        name: name,
      });

      if (holding) {
        // UPDATE existing holding
        const totalQty = holding.qty + parseInt(qty);
        const totalCost = holding.avg * holding.qty + price * qty;
        const newAvg = totalCost / totalQty;

        holding.qty = totalQty;
        holding.avg = newAvg;
        holding.price = price; // Update current price

        await holding.save();
        console.log("Updated holding:", holding);
      } else {
        // CREATE new holding
        const newHolding = new HoldingsModel({
          name,
          qty: parseInt(qty),
          avg: price,
          price: price,
          net: "+0.00%",
          day: "+0.00%",
          user: req.user._id,
        });

        await newHolding.save();
        console.log("Created new holding:", newHolding);
      }
    } else if (mode === "SELL") {
      // Reduce quantity in holdings
      let holding = await HoldingsModel.findOne({
        user: req.user._id,
        name: name,
      });

      if (holding) {
        holding.qty = holding.qty - parseInt(qty);

        // If quantity becomes 0 or negative, delete the holding
        if (holding.qty <= 0) {
          await HoldingsModel.deleteOne({ _id: holding._id });
          console.log("Deleted holding (qty = 0)");
        } else {
          await holding.save();
          console.log("Updated holding after sell:", holding);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  }),
);

// Get all holdings for the logged-in user
router.get(
  "/allHoldings",
  isAuthenticated,
  wrapAsync(async (req, res) => {
    console.log("Fetching holdings for user:", req.user._id);

    const userHoldings = await HoldingsModel.find({ user: req.user._id });

    console.log("Found holdings:", userHoldings.length);
    res.status(200).json(userHoldings);
  }),
);
module.exports = router;
