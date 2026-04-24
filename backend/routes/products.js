const router = require("express").Router();
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const { authenticate, authorize } = require("../middleware/auth");

// GET /api/products — public, with query/category/sort
router.get("/", async (req, res) => {
  try {
    const { q, category, sort } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (q) {
      const regex = new RegExp(q, "i");
      filter.$or = [{ name: regex }, { shopName: regex }, { category: regex }];
    }

    let query = Product.find(filter);

    if (sort === "low") query = query.sort({ price: 1 });
    else if (sort === "high") query = query.sort({ price: -1 });
    else if (sort === "rating") query = query.sort({ rating: -1 });
    else query = query.sort({ reviews: -1 }); // "popular"

    const products = await query;
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/categories
router.get("/categories", async (req, res) => {
  try {
    const cats = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const emojiMap = {
      Cricket: "🏏", Football: "⚽", Gym: "🏋️", Tennis: "🎾",
      Running: "👟", Yoga: "🧘", Cycling: "🚴", Boxing: "🥊",
      Basketball: "🏀", Swimming: "🏊", Skating: "🛹",
    };
    const result = cats.map((c) => ({
      name: c._id,
      count: c.count,
      emoji: emojiMap[c._id] || "🏅",
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — shop owner
router.post("/", authenticate, authorize("shop"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(400).json({ message: "No shop found for this user" });

    const product = await Product.create({
      ...req.body,
      shop: shop._id,
      shopName: shop.name,
      rating: 5,
      reviews: 0,
      badge: "New",
      image: req.body.image || "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=70",
    });

    // Update product count
    shop.productCount = await Product.countDocuments({ shop: shop._id });
    await shop.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id — shop owner
router.put("/:id", authenticate, authorize("shop"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id — shop owner
router.delete("/:id", authenticate, authorize("shop", "admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update shop product count
    if (product.shop) {
      const shop = await Shop.findById(product.shop);
      if (shop) {
        shop.productCount = await Product.countDocuments({ shop: shop._id });
        await shop.save();
      }
    }

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
