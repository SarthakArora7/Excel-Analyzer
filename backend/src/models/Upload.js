// models/Upload.js
import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema(
  {
    originalName: { 
        type: String, 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    }, // stored file name on disk
    mimeType: { 
        type: String, 
        required: true 
    },
    size: { 
        type: Number, 
        required: true 
    }, // bytes
    sheetNames: [String],
    columns: [String], // from the first sheet by default
    rowCount: { 
        type: Number, 
        default: 0 
    },
    previewRows: { 
        type: Array, 
        default: [] 
    }, // first ~20 rows for UI preview
    storagePath: { 
        type: String 
    }, // path on disk (uploads/...)
    notes: { 
        type: String 
    }, // optional
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { 
    type: Date, 
    default: Date.now 
  },
  },
  { timestamps: true }
);

export default mongoose.model("Upload", uploadSchema);
