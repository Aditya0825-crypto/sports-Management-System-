const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    disputeId: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    filedBy: { type: String, default: "" },
    filedByUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    orderId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dispute", disputeSchema);
