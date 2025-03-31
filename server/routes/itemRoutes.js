const express = require("express");
const Item = require("../models/Item");
const Barter = require("../models/BarterItem"); // Import Barter model
const authMiddleware = require("./authMiddleware");
const multer = require("multer");

const router = express.Router();

// Multer storage config (stores images in 'uploads' folder)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET all items (filtered by user location)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = req.user; // Get user details from middleware
    if (!user.location) {
      return res.status(400).json({ error: "User location is required" });
    }
    
    const items = await Item.find({ location: user.location }).populate("user", "name email contact");
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Error fetching items" });
  }
});

// POST route to add an item
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, location, category, barterOption } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({
      title,
      description,
      location,
      category,
      barterOption,
      image: imagePath,
      user: req.user.id, // Linking item to logged-in user
    });

    await newItem.save();

    // If the item is meant for barter, add it to the barter system
    if (barterOption !== "Giveaway") { 
      const newBarter = new Barter({
        itemId: newItem._id,
        owner: req.user.id,
        status: "available",
      });
      await newBarter.save();
    }

    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// GET a single item by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("user", "name email contact");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

// UPDATE an item
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ error: "Item not found" });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating item" });
  }
});

// DELETE an item
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting item" });
  }
});

module.exports = router;
