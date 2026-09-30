const mongoose = require("mongoose");

const userAccountSchema = new mongoose.Schema(
  {
    accountName: {
      type: String,
      required: true,
      trim: true,
    },

    accountType: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userAccountSchema.index({ accountName: 1 });

module.exports = mongoose.model("UserAccount", userAccountSchema);