require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const app = express();

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/UserModel.js");
const userRouter = require("./routes/user.js");
const MongoStore = require("connect-mongo").default;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      process.env.FRONTEND_URL,
      process.env.DASHBOARD_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

app.use(bodyParser.json());

const store = new MongoStore({
  mongoUrl: uri,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use("/", userRouter);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Please login first" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.get("/allHoldings", isLoggedIn, async (req, res) => {
  try {
    let allHoldings = await HoldingsModel.find({ user: req.userId });
    res.json(allHoldings);
  } catch (error) {
    console.error("Error fetching holdings:", error);
    res.status(500).json({ message: "Error fetching holdings" });
  }
});

app.get("/allPositions", isLoggedIn, async (req, res) => {
  try {
    let allPositions = await PositionsModel.find({ user: req.userId });
    res.json(allPositions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    res.status(500).json({ message: "Error fetching positions" });
  }
});

app.post("/newOrder", isLoggedIn, async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Save the order
    let newOrder = new OrdersModel({
      name,
      qty,
      price: parseFloat(price),
      mode,
      user: new mongoose.Types.ObjectId(req.userId),
    });

    await newOrder.save();

    // Update holdings based on BUY or SELL
    if (mode === "BUY") {
      // Find existing holding for this stock
      let holding = await HoldingsModel.findOne({
        name,
        user: new mongoose.Types.ObjectId(req.userId),
      });

      if (holding) {
        // Update existing holding
        const totalQty = holding.qty + qty;
        const totalCost = holding.avg * holding.qty + parseFloat(price) * qty;
        holding.qty = totalQty;
        holding.avg = totalCost / totalQty;
        holding.price = parseFloat(price); // Update to latest price
        await holding.save();
      } else {
        // Create new holding
        let newHolding = new HoldingsModel({
          name,
          qty,
          avg: parseFloat(price),
          price: parseFloat(price),
          net: "+0.00%",
          day: "+0.00%",
          isLoss: false,
          user: new mongoose.Types.ObjectId(req.userId),
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      // Find existing holding
      let holding = await HoldingsModel.findOne({
        name,
        user: new mongoose.Types.ObjectId(req.userId),
      });

      if (!holding) {
        return res.status(400).json({
          success: false,
          message: "You don't own this stock",
        });
      }

      if (holding.qty < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity. You only have ${holding.qty} shares`,
        });
      }

      // Reduce quantity
      holding.qty -= qty;

      if (holding.qty === 0) {
        // Remove holding if quantity is 0
        await HoldingsModel.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }
    }

    res.json({ success: true, message: "Order saved and holdings updated!" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});

app.get("/allOrders", isLoggedIn, async (req, res) => {
  try {
    let allOrders = await OrdersModel.find({ user: req.userId });
    res.json(allOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

app.get("/deleteuser", async (req, res) => {
  await User.deleteOne({ username: "test-student" });
  res.send("User deleted!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({ success: false, message });
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB started!");
});
