const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Trade, Borrow, Share
  location: { type: String, required: true },
  image: { type: String }, // For storing image URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Item", ItemSchema);
