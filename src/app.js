// app.js
const express = require("express");
const cors = require("cors");
const tradeRoutes = require("./routes/tradeRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use("/api", tradeRoutes);
app.use("/api", balanceRoutes);

module.exports = app;
