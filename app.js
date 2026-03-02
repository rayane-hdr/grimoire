require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// 👉 import des routes
const authRoutes = require("./src/routes/auth");

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// Middlewares
app.use(cors());
app.use(express.json());

// 👉 ICI on branche les routes
app.use("/api/auth", authRoutes);

// Route test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Grimoire backend is running ✅" });
});

module.exports = app;