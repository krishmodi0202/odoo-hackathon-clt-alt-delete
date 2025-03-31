const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String, required: true }, // Location-based filtering
  contact: { type: String, required: true }, // New contact field
  rating: { type: Number, default: 5 }, // Default rating for new users
});

module.exports = mongoose.model("User", UserSchema);
