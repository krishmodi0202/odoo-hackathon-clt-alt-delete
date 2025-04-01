const express = require("express");
const Item = require("../models/Item");
const Barter = require("../models/BarterItem"); // Import Barter model
const User = require("../models/User"); // Ensure user is correctly referenced
const authenticateToken = require("./authMiddleware"); // Fixed import
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer storage config (stores images in 'uploads' folder)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 📌 GET: All items (filtered by user location)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.location) {
      return res.status(400).json({ error: "User location is required. Please update your profile." });
    }

    const items = await Item.find({ location: user.location }).populate("userId", "name email contact");
    console.log(items)

    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Error fetching items" });
  }
});

// 📌 POST: Add a new barter item
router.post("/", authenticateToken, upload.single("image"), async (req, res) => {
  console.log("Headers:", req.headers.authorization); // Debugging: Check token

  try {
    const { title, description, location, category, barterOption } = req.body;
    console.log(req.body)

    if (!title || !description || !location || !category || !barterOption) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = req.file ? `http://localhost:4000/uploads/${req.file.filename}` : null;

    const newItem = new Item({
      userId: req.user._id,
      title:title,
      description:description,
      location:location,
      category:category,
      barterOption:barterOption,
      image: imagePath,
       // Linking item to logged-in user
    });

    await newItem.save();

    // 📌 If the item is for barter, add it to BarterItem collection
    // if (barterOption !== "Giveaway") {
    //   const newBarter = new Barter({
    //     itemId: newItem._id,
    //     owner: req.user._id,
    //     status: "available",
    //   });
    //   await newBarter.save();
    // }

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// 📌 GET: Fetch all user items
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userItems = await Item.find({ userId: req.user._id });
    res.json(userItems);
  } catch (error) {
    console.error("Error fetching user items:", error);
    res.status(500).json({ error: "Error fetching user items" });
  }
});

// 📌 GET: Fetch a single item by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("userId");
    console.log(item)
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: "Error fetching item" });
  }
});

// 📌 PUT: Update an item
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Error updating item" });
  }
});

// 📌 DELETE: Remove an item (also remove from barter system)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });

    // Also remove from barter system if it exists
    await Barter.deleteOne({ itemId: req.params.id });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Error deleting item" });
  }
});

module.exports = router;
