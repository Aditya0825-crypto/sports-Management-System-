const mongoose = require("mongoose");

const deliveryJobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    distance: { type: String, default: "" },
    payout: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Available", "Assigned", "In transit", "Delivered"],
      default: "Available",
    },
    customer: { type: String, default: "" },
    courier: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeliveryJob", deliveryJobSchema);
