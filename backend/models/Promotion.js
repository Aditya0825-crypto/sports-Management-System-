const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    promoId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    discount: { type: String, required: true },
    scope: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Paused", "Scheduled"],
      default: "Active",
    },
    ends: { type: String, default: "" },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", promotionSchema);
