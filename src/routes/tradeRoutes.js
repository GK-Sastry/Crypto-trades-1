// routes/tradeRoutes.js
const express = require("express");
const multer = require("multer");
const tradeController = require("../controllers/tradeController");
const path = require("path");
const router = express.Router();

// Set up multer for file upload handling with size limit
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only CSV files
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only CSV files are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// Route to upload and process trades
router.post("/upload", upload.single("file"), tradeController.uploadTrades);

module.exports = router;
