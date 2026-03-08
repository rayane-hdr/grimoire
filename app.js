require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const booksRoutes = require("./src/routes/books");

const app = express();

/* ============================
   🔌 Connexion MongoDB
============================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((error) =>
    console.error("❌ MongoDB connection error:", error)
  );

/* ============================
   🌍 CORS (version OC safe)
============================ */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/* ============================
   🧱 Middlewares globaux
============================ */
app.use(express.json());

/* ============================
   📁 Dossier images
============================ */
app.use("/images", express.static(path.join(__dirname, "images")));

/* ============================
   📌 Routes API
============================ */
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

/* ============================
   🧪 Route test
============================ */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Grimoire backend is running ✅",
  });
});

module.exports = app;