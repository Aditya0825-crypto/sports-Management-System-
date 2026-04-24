const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String, default: "" },
    bio: { type: String, default: "" },
    city: { type: String, default: "" },
    hours: { type: String, default: "" },
    productCount: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    status: {
      type: String,
      enum: ["Active", "Pending", "Suspended"],
      default: "Pending",
    },
    followers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
