// utils/csvParser.js
const fs = require("fs");
const readline = require("readline");
const path = require("path");

// Helper function to parse a line of CSV
const parseCSVLine = (line) => {
  // Split the line by comma to extract values
  const [userID, utcTime, operation, market, amount, price] = line.split(",");

  // Split the market into baseCoin and quoteCoin
  const [baseCoin, quoteCoin] = market.split("/");

  // Validate userID is present
  if (!userID) {
    throw new Error("Missing userID");
  }

  // Validate operation is either 'buy' or 'sell'
  if (!["buy", "sell"].includes(operation.toLowerCase())) {
    throw new Error(`Invalid operation: ${operation}`);
  }

  // Convert amount to a float and check if it's a valid number
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    throw new Error(`Invalid amount: ${amount}`);
  }

  // Convert price to a float and check if it's a valid number
  const parsedPrice = parseFloat(price);
  if (isNaN(parsedPrice)) {
    throw new Error(`Invalid price: ${price}`);
  }

  return {
    userID,
    utcTime: new Date(utcTime).toISOString(), // Convert to ISO string format
    operation: operation.toLowerCase(), // Ensure operation is in lowercase
    market,
    baseCoin,
    quoteCoin,
    amount: parsedAmount,
    price: parsedPrice,
  };
};

// Function to parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileStream = fs.createReadStream(filePath);

    // Create readline interface for reading file line by line
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity, // Handle different line endings
    });

    let isFirstLine = true; // Flag to skip header line

    rl.on("line", (line) => {
      if (isFirstLine) {
        isFirstLine = false; // Skip the header line
        return;
      }

      try {
        const parsedLine = parseCSVLine(line);
        results.push(parsedLine);
      } catch (error) {
        // Log error and continue processing other lines
        console.error(`Error parsing line: ${error.message}`);
      }
    });

    rl.on("close", () => resolve(results)); // Resolve promise when file is fully read
    rl.on("error", (error) => reject(error)); // Reject promise on file read error
  });
};

module.exports = {
  parseCSV,
};
