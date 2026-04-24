const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: String,
    qty: { type: Number, default: 1 },
    price: Number,
  },
  { _id: false }
);

const trackingStepSchema = new mongoose.Schema(
  {
    label: String,
    time: String,
    done: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, default: "" },
    items: [orderItemSchema],
    itemCount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Picked up", "In transit", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    shopName: { type: String, default: "" },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    trackingSteps: [trackingStepSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
