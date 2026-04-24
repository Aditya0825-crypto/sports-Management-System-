const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
  {
    rentalId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerName: { type: String, default: "" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    productName: { type: String, default: "" },
    days: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    totalPrice: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Returned", "Overdue"],
      default: "Active",
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    shopName: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rental", rentalSchema);
