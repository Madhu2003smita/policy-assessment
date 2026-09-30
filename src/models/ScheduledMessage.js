const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed"],
      default: "scheduled",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "scheduledmessages",
  }
);

module.exports = mongoose.model(
  "ScheduledMessage",
  scheduledMessageSchema
);