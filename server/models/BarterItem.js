const mongoose = require("mongoose");

const barterItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    barterOption: { type: String, required: true }, // e.g., "Exchange for Books"
    image: { type: String }, // URL of the image
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  },
  { timestamps: true }
);

const BarterItem = mongoose.model("BarterItem", barterItemSchema);
module.exports = BarterItem;
