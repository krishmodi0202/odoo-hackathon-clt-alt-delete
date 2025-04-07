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

router.put('/:requestId',authenticate, async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body; // Get the new status from the query parameter

    // Validate status
    const validStatuses = ['pending', 'accepted', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({
      message: `Request status updated to ${status}`,
      request: updatedRequest
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});
// GET /api/requests/sent
router.get('/sent',authenticate, async (req, res) => {
  try {
    const userId = req.user._id; // ensure you’re using authentication middleware
    const requests = await Request.find({ requesterId: userId })
      .populate("itemId")
      .populate("ownerId");
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching sent requests", error);
    res.status(500).json({ message: "Failed to fetch sent requests" });
  }
});


module.exports = router;
