const express = require("express");
const BarterItem = require("../models/BarterItem.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await BarterItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching barter items" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newItem = new BarterItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Error posting barter item" });
  }
});

module.exports = router;
