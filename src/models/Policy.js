const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      trim: true,
    },

    policyStartDate: Date,

    policyEndDate: Date,

    policyCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lob",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },

    premiumAmount: Number,

    premiumAmountWritten: Number,

    policyType: String,

    policyMode: Number,

    producer: String,

    csr: String,
  },
  {
    timestamps: true,
  }
);

policySchema.index({ policyNumber: 1 });
policySchema.index({ userId: 1 });

module.exports = mongoose.model("Policy", policySchema);