// models/trade.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for cryptocurrency trade data
const tradeSchema = new Schema(
  {
    // Included userID to facilitate future expansion for multiple users.
    // The current task assumes all trades belong to a single user, but we added this field for scalability.

    // Note: This field may introduce redundancy if the single-user assumption remains unchanged.
    // If we find that this assumption holds in the long term, it would be better to remove this field to avoid unnecessary complexity.
    userID: { type: Schema.Types.String, required: true },
    utcTime: { type: Date, required: true },
    operation: { type: String, enum: ["buy", "sell"], required: true },
    market: { type: String, required: true },
    baseCoin: { type: String, required: true },
    quoteCoin: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create indexes to improve query performance
tradeSchema.index({ userID: 1 });
tradeSchema.index({ utcTime: -1 });
tradeSchema.index({ baseCoin: 1, quoteCoin: 1 });

// Compile schema into a model
const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
