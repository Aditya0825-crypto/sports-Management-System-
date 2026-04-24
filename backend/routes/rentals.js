const router = require("express").Router();
const Rental = require("../models/Rental");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const { emitRealtime } = require("../realtime");
const { authenticate, authorize } = require("../middleware/auth");

let rentalCounter = 100;

// GET /api/rentals
router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "customer") filter.customer = req.user._id;
    else if (req.user.role === "shop") {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (shop) filter.shopName = shop.name;
    }

    const rentals = await Rental.find(filter).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/rentals — create rental (customer)
router.post("/", authenticate, authorize("customer"), async (req, res) => {
  try {
    const { productId, days } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (!product.rentPerDay) return res.status(400).json({ message: "Product not available for rent" });

    rentalCounter++;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const rental = await Rental.create({
      rentalId: `RNT-${rentalCounter}`,
      customer: req.user._id,
      customerName: req.user.name,
      product: product._id,
      productName: product.name,
      days,
      pricePerDay: product.rentPerDay,
      totalPrice: product.rentPerDay * days,
      dueDate,
      shopName: product.shopName,
    });

    emitRealtime("rentals:updated", { reason: "created" });
    emitRealtime("analytics:updated", { reason: "rental-created" });
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/rentals/:id/status
router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    rental.status = status;
    await rental.save();
    emitRealtime("rentals:updated", { reason: "status-changed", rentalId: rental._id });
    emitRealtime("analytics:updated", { reason: "rental-status-changed" });
    res.json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
