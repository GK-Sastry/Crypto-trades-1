// utils/db.js
const mongoose = require("mongoose");
const winston = require("winston");
require("dotenv").config();
const process = require("process");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

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
