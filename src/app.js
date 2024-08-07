// app.js
const express = require("express");
const connectDB = require("./utils/db");

const app = express();

// Connect to the database
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
