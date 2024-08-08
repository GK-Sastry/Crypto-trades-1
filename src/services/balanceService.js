// services/balanceService.js
const Trade = require("../models/trade");
const logger = require("../configuration/logger"); // Import logger for consistent logging
const { parseISO } = require("date-fns"); // Use date-fns for better date parsing

/**
 * Calculates the asset balance at a given timestamp.
 *
 * @param {string} timestamp - The timestamp up to which the balance should be calculated.
 * @returns {object} - An object containing the asset balances.
 * @throws {Error} - Throws an error if there's a problem with the database query or balance calculation.
 */
const calculateAssetBalance = async (timestamp) => {
  try {
    // Validate and parse timestamp
    const parsedTimestamp = parseISO(timestamp);
    if (isNaN(parsedTimestamp.getTime())) {
      throw new Error("Invalid timestamp format");
    }

    // Fetch trades up to the given timestamp
    const trades = await Trade.find({
      utcTime: { $lte: parsedTimestamp },
    }).exec(); // Explicitly execute query

    if (trades.length === 0) {
      logger.info(`No trades found up to timestamp: ${timestamp}`);
    }

    const balance = {};

    // Process each trade to calculate balances
    trades.forEach((trade) => {
      const { baseCoin, quoteCoin, operation, amount } = trade;

      // Initialize baseCoin balance if not already present
      if (!balance[baseCoin]) {
        balance[baseCoin] = 0;
      }
      balance[baseCoin] += operation === "buy" ? amount : -amount;

      // Future extension: If baseCoin is also used as a quoteCoin, we can adjust balances accordingly
      // This functionality can be extended to account for trades where baseCoin is used as quoteCoin
    });

    // Remove assets with zero balance
    Object.keys(balance).forEach((asset) => {
      if (balance[asset] === 0) {
        delete balance[asset];
      }
    });

    return balance;
  } catch (error) {
    logger.error(`Error calculating asset balance: ${error.message}`);
    throw new Error("Error calculating asset balance"); // Throw generic error to avoid leaking details
  }
};

module.exports = {
  calculateAssetBalance,
};
