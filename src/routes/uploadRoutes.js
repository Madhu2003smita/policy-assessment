const express = require("express");
const multer = require("multer");
const path = require("path");

const { startImportWorker } = require("../services/importService");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".csv", ".xlsx", ".xls"];

    const extension = path
      .extname(file.originalname)
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return cb(
        new Error("Only CSV, XLSX and XLS files are allowed")
      );
    }

    cb(null, true);
  },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a CSV or XLSX file",
      });
    }

    console.log("File uploaded:", req.file.path);

    const result = await startImportWorker(req.file.path);

    return res.status(201).json({
      success: true,
      message: "File uploaded and imported successfully",
      file: req.file.filename,
      rowsProcessed: result.rowsProcessed,
      policiesImported: result.policiesImported,
    });
  } catch (error) {
    console.error("Import error:", error);

    return res.status(500).json({
      success: false,
      message: "File import failed",
      error: error.message,
    });
  }
});

module.exports = router;