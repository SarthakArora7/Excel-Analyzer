import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import xlsx from "xlsx";
import Upload from "../models/Upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const uploadRoutes = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || "src/uploads";
const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 20);
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

// ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // safe filename with timestamp
    const time = Date.now();
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${base}_${time}${ext}`);
  },
});

// only allow .xls/.xlsx
const fileFilter = (req, file, cb) => {
  const allowed =
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    [".xls", ".xlsx"].includes(path.extname(file.originalname).toLowerCase());
  if (!allowed) return cb(new Error("Only .xls and .xlsx files are allowed"));
  cb(null, true);
};

const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single("file");

// POST /api/upload  -> multipart/form-data with "file"
uploadRoutes.post("/", authMiddleware, (req, res) => {
  uploadMiddleware(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(413)
            .json({ error: `File too large. Max ${MAX_FILE_SIZE_MB} MB.` });
        }
        return res.status(400).json({ error: err.message || "Upload failed" });
      }
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      const filePath = path.join(UPLOAD_DIR, req.file.filename);
      // read workbook
      const wb = xlsx.readFile(filePath, { cellDates: true });
      const sheetNames = wb.SheetNames || [];
      if (!sheetNames.length) {
        return res
          .status(400)
          .json({ error: "No sheets found in the Excel file" });
      }

      // default: first sheet
      const firstSheet = wb.Sheets[sheetNames[0]];
      // get header row
      const headerRows = xlsx.utils.sheet_to_json(firstSheet, {
        header: 1,
        raw: false,
      });
      const headers = (headerRows[0] || []).map((h) =>
        h !== undefined && h !== null ? String(h) : ""
      );

      // convert to JSON (records) & get preview
      const json = xlsx.utils.sheet_to_json(firstSheet, { defval: null }); // array of objects
      const preview = json.slice(0, 20);
      const rowCount = json.length;

      const userId = req.user.id
    //   console.log(userId)
      // save metadata in DB
      const doc = await Upload.create({
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        sheetNames,
        columns: headers,
        rowCount,
        previewRows: preview,
        storagePath: filePath,
        user: userId,
      });

      return res.status(201).json({
        uploadId: doc._id,
        originalName: doc.originalName,
        sheetNames,
        columns: headers,
        rowCount,
        previewRows: preview,
      });
    } catch (e) {
      console.error(e);
      return res
        .status(500)
        .json({ error: "Server error while processing file" });
    }
  });
});

// GET /api/upload/:id -> get saved metadata + preview
uploadRoutes.get("/:id", async (req, res) => {
  try {
    const doc = await Upload.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Upload not found" });

    res.json({
      uploadId: doc._id,
      originalName: doc.originalName,
      sheetNames: doc.sheetNames,
      columns: doc.columns,
      rowCount: doc.rowCount,
      previewRows: doc.previewRows,
    });
  } catch (err) {
    console.error("Error fetching upload:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/upload -> list recent uploads (no auth yet, so show all)
uploadRoutes.get("/", async (req, res) => {
  try {
    const items = await Upload.find({})
      .sort({ createdAt: -1 })
      .select("_id originalName rowCount columns createdAt")
      .limit(20)
      .lean();
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

export default uploadRoutes;
