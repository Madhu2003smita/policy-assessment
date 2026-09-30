const mongoose = require("mongoose");

const carrierSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

carrierSchema.index({ companyName: 1 });

module.exports = mongoose.model("Carrier", carrierSchema);