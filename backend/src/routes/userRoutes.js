import express from "express";
import Upload from "../models/Upload.js";
import ChartHistory from "../models/ChartHistory.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();

// Get uploads for logged-in user
userRoutes.get("/uploads", authMiddleware, async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.id }).sort({
      uploadedAt: -1,
    });
    res.json(uploads);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get chart history for logged-in user
userRoutes.get("/charts", authMiddleware, async (req, res) => {
  try {
    const charts = await ChartHistory.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(charts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default userRoutes;
