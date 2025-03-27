const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("./passport")
const authRoutes = require("./routes/authRoutes");
const saveRoute = require("./routes/saveRoute")

require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "https://new-letter-app.vercel.app/", // frontend URL from Vercel
    credentials: true,
  })
);
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: false,cookie: {
    httpOnly: true,
    secure: false, // Set to `true` in production with HTTPS
    sameSite: "lax",
  },
   }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB Connected"));


app.use("/auth", authRoutes);
app.use("/api", saveRoute)



app.listen(5000, () => console.log("Server running on port 5000"));


