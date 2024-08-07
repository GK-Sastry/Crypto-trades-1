// app.js
const express = require("express");
const connectDB = require("./configuration/db");
const cors = require("cors");
const tradeRoutes = require("./routes/tradeRoutes");
const balanceRoutes = require("./routes/balanceRoutes");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Use routes
app.use("/api", tradeRoutes);
app.use("/api", balanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
