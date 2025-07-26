const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const googleAuthRoutes = require("./routes/googleLogin");

const app = express();
const PORT = process.env.PORT || 5050;
// Add these middlewares before any `app.use(...)` that uses passport
app.use(
  session({
    secret: "yourSecret", // replace with a strong secret
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize()); 
app.use(passport.session());

// Add the Google Auth route
app.use("/", googleAuthRoutes);
app.use(
  cors({
    origin: "http://localhost:3000", // Next.js dev server
    credentials: true, // Only if you use cookies/sessions
  })
);
app.use(express.json());

const authRoutes = require("./routes/auth");
const homePageRoutes = require("./routes/homePage");

app.use("/api", authRoutes);
app.use("/api", homePageRoutes);

const mogoDb =
  "mongodb+srv://premvishwakarma54:AouqOsuTVtx9ktbG@cluster0.ekxxrvg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || mogoDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error: ", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
