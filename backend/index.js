const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
require("./passport");

const authRoutes = require("./routes/authRoutes");
const saveRoute = require("./routes/saveRoute");

const app = express();

// Trust proxy for secure cookies to work on Render
app.set("trust proxy", 1);

// Enable CORS for frontend on Vercel
app.use(
  cors({
    origin: "https://new-letter-app.vercel.app",
    credentials: true,
  })
);

app.use(express.json());

// Proper session setup for cross-origin login
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log("MongoDB Connected")
);

app.use("/auth", authRoutes);
app.use("/api", saveRoute);

app.listen(5000, () => console.log("Server running on port 5000"));
