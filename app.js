// app.js
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.status(200).json({ message: "Grimoire backend is running ✅" });
});

module.exports = app;