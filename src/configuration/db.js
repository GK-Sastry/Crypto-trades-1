// configuration/db.js
const mongoose = require("mongoose");
const logger = require("./logger");
require("dotenv").config({ path: "../.env" });
const process = require("process");

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    logger.error("MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  const connect = async () => {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info("MongoDB connected successfully");
    } catch (error) {
      logger.error("MongoDB connection failed: " + error.message);
      setTimeout(connect, 5000); // Retry after 5 seconds
    }
  };

  connect();

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB connection lost. Reconnecting...");
    connect();
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected");
  });
};

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    logger.info(`MongoDB disconnected through ${msg}`);
    callback();
  });
};

// For nodemon restarts
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});

// For app termination
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

module.exports = connectDB;
