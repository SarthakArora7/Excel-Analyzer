import express from "express"

const adminRoutes = express.Router();

import User from "../models/User.js";
import Upload from "../models/Upload.js";
import ChartHistory from "../models/ChartHistory.js";

// 1. List all users
adminRoutes.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("id name email role createdAt")
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" + err });
  }
});

// 2. Update user role
adminRoutes.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;

    // Mongoose: findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true } // return updated document
    );

    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User role updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update role" });
  }
});

// 3. Delete user
adminRoutes.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) return res.status(404).json({ error: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user " + err });
  }
});

// 4. System stats
adminRoutes.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDatasets = await Upload.countDocuments();
    const totalCharts = await ChartHistory.countDocuments();

    // Example storage calculation
    const uploads = await Upload.find().select("size");
    const storageUsed = uploads.reduce(
      (acc, upload) => acc + (upload.fileSizeMB || 0),
      0
    );

    res.json({
      totalUsers,
      totalDatasets,
      totalCharts,
      storageUsedMB: storageUsed || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats " + err });
  }
});

// 5. User-specific usage
adminRoutes.get("/usage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const datasetsUploaded = await Upload.countDocuments({ userId } );
    const chartsGenerated = await ChartHistory.countDocuments({ userId });
    const uploads = await Upload.find({ userId }).select("size");
    const storageUsed = uploads.reduce(
    (acc, upload) => acc + (upload.fileSizeMB || 0),
    0
    );

    res.json({
      userId,
      datasetsUploaded,
      chartsGenerated,
      storageUsedMB: storageUsed || 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user usage " + err });
  }
});

export default adminRoutes
