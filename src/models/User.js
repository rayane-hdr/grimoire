const mongoose = require("mongoose");

// ✅ Fix: récupérer la fonction du module (selon la version, elle peut être dans .default)
const uniqueValidator = require("mongoose-unique-validator");
const uniqueValidatorPlugin = uniqueValidator.default || uniqueValidator;

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidatorPlugin);

module.exports = mongoose.model("User", userSchema);