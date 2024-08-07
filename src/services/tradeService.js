//  services/tradeService.js
const Trade = require("../models/trade");
const logger = require("../configuration/logger"); // Ensure this path is correct

// Function to save trades in bulk with enhanced error handling and logging
const saveTradesBulk = async (trades) => {
  // Validate that the trades array is not empty
  if (!Array.isArray(trades) || trades.length === 0) {
    logger.error("No trades to save. The trades array is empty.");
    throw new Error("No trades to save. The trades array is empty.");
  }

  try {
    // Extract unique trades to insert
    const uniqueTrades = [];
    for (const trade of trades) {
      const exists = await Trade.findOne({
        userID: trade.userID,
        utcTime: trade.utcTime,
        operation: trade.operation,
        baseCoin: trade.baseCoin,
        quoteCoin: trade.quoteCoin,
        amount: trade.amount,
      });

      if (!exists) {
        uniqueTrades.push(trade);
      }
    }

    if (uniqueTrades.length > 0) {
      // Insert unique trades into the database
      const result = await Trade.insertMany(uniqueTrades, { ordered: false });

      // Log the number of documents inserted
      logger.info(`Successfully inserted ${result.length} trades.`);
      return result;
    } else {
      logger.info("No new trades to insert.");
      return [];
    }
  } catch (error) {
    // Handle specific MongoDB errors
    if (error.name === "BulkWriteError") {
      // Log the errors for further investigation
      logger.error("Bulk write error details:", { errors: error.writeErrors });
      throw new Error(
        "Error saving trades in bulk: Some trades may have failed to save."
      );
    }

    // General error handling
    logger.error("Error saving trades in bulk:", { message: error.message });
    throw new Error("Error saving trades in bulk: " + error.message);
  }
};

module.exports = {
  saveTradesBulk,
};
