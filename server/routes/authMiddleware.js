const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "No token provided. Authentication required." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");


    if (!req.user) {
      return res.status(401).json({ error: "User not found. Authentication failed." });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ error: "Invalid token. Please log in again." });
  }
};

module.exports = authMiddleware;
