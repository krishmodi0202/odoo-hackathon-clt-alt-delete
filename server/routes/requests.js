const express = require("express");
const router = express.Router();
const authenticate = require("../routes/authMiddleware");
const Request = require("../models/Request");

// Send barter request
router.post("/", authenticate, async (req, res) => {
  try {
    const { itemId, ownerId, message, offerDetails } = req.body;
    const requesterId = req.user.id;

    // console.log(req.body)

    if (requesterId === ownerId) {
      return res.status(400).json({ error: "You cannot barter your own item." });
    }

    const newRequest = new Request({
      itemId,
      ownerId,
      requesterId,
      message,
      offerDetails,
      status: "pending",
    });

    await newRequest.save();
    res.status(201).json({ message: "Barter request sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
