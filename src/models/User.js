const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: Date,

    address: String,

    phoneNumber: String,

    state: String,

    zipCode: String,

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    gender: String,

    userType: String,

    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ firstName: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);