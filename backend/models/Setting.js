const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "platform" },
    commission: { type: Number, default: 12 },
    refundWindow: { type: Number, default: 7 },
    deliveryBase: { type: Number, default: 2 },
    perKm: { type: Number, default: 0.6 },
    signupOpen: { type: Boolean, default: true },
    verifyShops: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Setting", settingSchema);
