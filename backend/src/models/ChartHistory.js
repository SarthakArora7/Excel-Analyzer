import mongoose from "mongoose";

const chartHistorySchema = new mongoose.Schema({
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Upload",
    required: true,
  },
  chartType: {
    type: String,
    enum: ["bar", "line", "scatter", "pie", "3d"],
    required: true,
  },
  xAxis: { 
    type: String, 
    required: true 
  },
  yAxis: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default mongoose.model("ChartHistory", chartHistorySchema);