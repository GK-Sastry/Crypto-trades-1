// controllers/tradeControllers.js
const tradeService = require("../services/tradeService");
const csvParser = require("../utils/csvParser");
const path = require("path");
const fs = require("fs");
const logger = require("../configuration/logger");

const uploadTrades = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const filePath = path.join(__dirname, "../../uploads", req.file.filename);
  const errorFilePath = path.join(__dirname, "../../errors", req.file.filename);

  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "File not found.", filePath, __dirname });
    }

    // Parse the CSV file
    const trades = await csvParser.parseCSV(filePath);

    // Save trades to the database
    await tradeService.saveTradesBulk(trades);

    // Remove the file after processing
    fs.unlinkSync(filePath);

    res.status(200).send("File uploaded and data saved to database.");
  } catch (error) {
    // Log the error with details
    logger.error("Error processing file: " + error.message);
    //move the file to errors directory
    fs.renameSync(filePath, errorFilePath);

    // Respond with an error message
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};

module.exports = {
  uploadTrades,
};
