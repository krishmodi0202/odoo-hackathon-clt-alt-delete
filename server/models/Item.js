const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  barterOption: { type: String, required: true },
  image: { type: String, required: true }, // Store image URL
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", itemSchema);
