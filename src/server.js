// server.js
const app = require("./app"); // Import the app
const connectDB = require("./configuration/db");

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
