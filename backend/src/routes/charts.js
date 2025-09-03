import express from "express"
import ChartHistory from "../models/ChartHistory.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const chartRoutes = express.Router();

// POST /api/charts
// chartRoutes.post("/", async (req, res) => {
//   try {
//     const { uploadId, chartType, xAxis, yAxis } = req.body;
//     const chart = await ChartHistory.create({
//       uploadId,
//       chartType,
//       xAxis,
//       yAxis,
//     });
//     res.status(201).json(chart);
//   } catch (err) {
//     console.error("Error saving chart:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });


// Save chart history
chartRoutes.post("/save", authMiddleware, async (req, res) => {
  try {
    const { uploadId, xAxis, yAxis, chartType } = req.body; // `data` could include chart config, labels, values
    const chart = new ChartHistory({
      uploadId, 
      xAxis,
      yAxis,
      chartType,
      user: req.user.id,
    });
    await chart.save();
    res.json({ message: "Chart saved", chart });
  } catch (err) {
    console.error("Error saving chart:", err.message);
    res.status(500).json({ error: err.message });
    // res.status(500).json({ error: "Failed to save chart" });
  }
});

export default chartRoutes;
