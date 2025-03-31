require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const connectionString = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Neighborhood Exchange API is Running...");
});

// Importing routes (change from import to require)
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/itemRoutes");
const barterRoutes = require("./routes/barterRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/barter-items", barterRoutes);

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
