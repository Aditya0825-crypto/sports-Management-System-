const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rentPerDay: { type: Number, default: null },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", default: null },
    shopName: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    image: { type: String, default: "" },
    badge: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", category: "text", shopName: "text" });

module.exports = mongoose.model("Product", productSchema);
