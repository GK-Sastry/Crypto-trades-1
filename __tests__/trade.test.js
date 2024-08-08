const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/app"); // Adjust the path to your app file
const logger = require("../src/configuration/logger");
const fs = require("fs");
const path = require("path");

describe("Trade API", () => {
  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_TEST_URI;

    if (!mongoURI) {
      logger.error("MONGODB_TEST_URI is not defined in environment variables");
      throw new Error("MONGODB_TEST_URI is required for testing");
    }

    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      logger.info("MongoDB connected successfully for testing");
    } catch (error) {
      logger.error("MongoDB connection failed: " + error.message);
      throw error; // Rethrow the error to prevent tests from running
    }
  });

  afterAll(async () => {
    try {
      await mongoose.disconnect();
      logger.info("MongoDB disconnected successfully after tests");
    } catch (error) {
      logger.error("Error disconnecting MongoDB: " + error.message);
    }
  });

  it("should upload trade data and return 200 status", async () => {
    const response = await request(app)
      .post("/api/upload") // Adjust the endpoint as needed
      .attach("file", "__tests__/test.csv"); // Path to your test CSV file

    console.log(response.text); // Log response body to debug
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("File uploaded and data saved to database."); // Adjust based on your API response
  });

  it("should retrieve balance at multiple timestamps", async () => {
    const timestampsFilePath = path.join(__dirname, "timestamps.txt");
    // Read the file as a string
    const timestamps = fs.readFileSync(timestampsFilePath, "utf-8").split("\n");

    for (const timestamp of timestamps) {
      const trimmedTimestamp = timestamp.trim(); // Ensure there are no extra spaces

      console.log(`Sending request for timestamp: ${trimmedTimestamp}`);
      const response = await request(app)
        .post("/api/balance")
        .send({ timestamp: trimmedTimestamp });

      console.log(`Response for ${trimmedTimestamp}:`, response.body);
      if (response.statusCode !== 200) {
        console.error(
          `Error for timestamp ${trimmedTimestamp}:`,
          response.body
        );
      }

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    }
  });
});
