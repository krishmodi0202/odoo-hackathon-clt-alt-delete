const express = require("express");
const BarterItem = require("../models/BarterItem.js");
const Request = require("../models/Request.js")
const Item = require("../models/Item.js"); // Import Item model
const authMiddleware = require("./authMiddleware"); // Import middleware

const router = express.Router();

// ✅ GET barter items uploaded by the logged-in user
router.get("/barter-items", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // Get logged-in user ID
    const items = await Item.find({ user: userId });

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching barter items:", error);
    res.status(500).json({ message: "Error fetching barter items" });
  }
});

// ✅ GET barter requests received by the logged-in user
router.get("/barter-requests", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch barter requests where the logged-in user is the owner
    const requests = await Request.find({ ownerId: userId }).populate("itemId").populate("requesterId");
    console.log(requests)

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching barter requests:", error);
    res.status(500).json({ message: "Error fetching barter requests" });
  }
});

// ✅ POST a new barter item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    const newBarterItem = new BarterItem({
      itemId,
      owner: req.user._id, // Attach logged-in user as the owner
      status: "available",
    });

    await newBarterItem.save();
    res.status(201).json(newBarterItem);
  } catch (error) {
    console.error("Error posting barter item:", error);
    res.status(500).json({ message: "Error posting barter item" });
  }
});

module.exports = router;
