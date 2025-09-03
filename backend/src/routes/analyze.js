import express from "express";
import dfjs from "danfojs-node";
import path from "path";
import fs from "fs";

const router = express.Router();

// 🔹 Helper to load dataset from saved uploads
async function loadDataset(fileId) {  // send xlsx file with .xlsx extension.
  const filePath = path.join("uploads", fileId); 
  if (!fs.existsSync(filePath)) throw new Error("Dataset not found");

  const XLSX = require("xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.SheetNames[0];
  const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
  const df = dfjs.DataFrame(jsonData);
  return df;
}

// 🔹 1. Summary Statistics
router.get("/:id/summary", async (req, res) => {
  try {
    const df = await loadDataset(req.params.id);
    const summary = df.describe().toJSON();

    // Add categorical summary manually
    const categoricalSummary = {};
    df.columns.forEach((col) => {
      if (df[col].dtype === "string") {
        categoricalSummary[col] = {
          unique: df[col].unique().values.length,
          top: df[col].mode().values[0],
        };
      }
    });

    res.json({ numeric: summary, categorical: categoricalSummary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 2. Correlation Matrix
router.get("/:id/correlation", async (req, res) => {
  try {
    const df = await loadDataset(req.params.id);

    // select only numeric cols
    const numericCols = df.columns.filter(
      (col) => df[col].dtype === "int32" || df[col].dtype === "float32"
    );
    const numericDf = df.loc({ columns: numericCols });

    const corrMatrix = numericDf.corr().toJSON();
    res.json({ correlation: corrMatrix });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 3. Outlier Detection (IQR Method)
router.get("/:id/outliers", async (req, res) => {
  try {
    const df = await loadDataset(req.params.id);
    const numericCols = df.columns.filter(
      (col) => df[col].dtype === "int32" || df[col].dtype === "float32"
    );

    const outliers = [];

    numericCols.forEach((col) => {
      const series = df[col];
      const q1 = series.quantile(0.25);
      const q3 = series.quantile(0.75);
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;

      series.values.forEach((val, idx) => {
        if (val < lower || val > upper) {
          outliers.push({
            row: idx,
            column: col,
            value: val,
          });
        }
      });
    });

    res.json({ outliers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 4. Column Insights
router.get("/:id/insights", async (req, res) => {
  try {
    const df = await loadDataset(req.params.id);

    const insights = {};
    df.columns.forEach((col) => {
      const series = df[col];
      insights[col] = {
        dtype: series.dtype,
        missing: series.isNa().sum(),
        unique: series.unique().values.length,
        top: series.mode().values[0],
      };

      if (series.dtype === "int32" || series.dtype === "float32") {
        insights[col].min = series.min();
        insights[col].max = series.max();
      }
    });

    res.json({ insights });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
