// controllers/balanceControllers.js
const balanceService = require("../services/balanceService");
const logger = require("../configuration/logger");

const getAssetBalance = async (req, res) => {
  try {
    const { timestamp } = req.body;

    if (!timestamp) {
      return res.status(400).json({ message: "Timestamp is required" });
    }

    const balance = await balanceService.calculateAssetBalance(timestamp);

    res.status(200).json(balance);
  } catch (error) {
    logger.error("Error fetching asset balance: " + error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAssetBalance,
};
