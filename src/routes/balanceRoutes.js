// routes/balanceRoutes.js
const express = require("express");
const balanceController = require("../controllers/balanceController");
const router = express.Router();

// Route to get asset balance at a given timestamp
router.post("/balance", balanceController.getAssetBalance);

module.exports = router;
