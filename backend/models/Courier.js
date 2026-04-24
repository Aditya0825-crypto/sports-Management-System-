const mongoose = require("mongoose");

const courierSchema = new mongoose.Schema(
  {
    courierId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    name: { type: String, required: true },
    zone: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    deliveries: { type: Number, default: 0 },
    status: { type: String, enum: ["Online", "Offline"], default: "Online" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courier", courierSchema);
