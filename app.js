require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 🔐 Routes & middleware
const authRoutes = require("./src/routes/auth");
const auth = require("./src/middleware/auth");

const app = express();

// 🔌 Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// 🧱 Middlewares globaux
app.use(cors());
app.use(express.json());

// 📌 Routes publiques
app.use("/api/auth", authRoutes);

// 🔒 Route protégée (test JWT)
app.get("/api/protected", auth, (req, res) => {
  res.status(200).json({
    message: "Accès OK ✅",
    userIdFromToken: req.auth.userId,
  });
});

// 🧪 Route test simple
app.get("/", (req, res) => {
  res.status(200).json({ message: "Grimoire backend is running ✅" });
});

module.exports = app;