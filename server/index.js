require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const connectionString = process.env.MONGO_URI;
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Neighborhood Exchange API is Running...");
});

app.use("/uploads",(req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();}, express.static(path.join(__dirname,"uploads")));

// Importing routes (change from import to require)
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/itemRoutes");
const barterRoutes = require("./routes/barterRoutes");
const requestRoutes = require("./routes/requests")
// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/barter-items", barterRoutes);
app.use("/api/requests",requestRoutes)

// app.get("/api/items/:id", async (req, res) => {
//   try {
//     const item = await Item.findById(req.params.id); // Fetch item by ID
//     if (!item) {
//       return res.status(404).json({ message: "Item not found" });
//     }
//     res.json(item);
//   } catch (error) {
//     console.error("Error fetching item:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
mongoose
  .connect(connectionString)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });
