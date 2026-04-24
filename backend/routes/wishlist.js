const router = require("express").Router();
const Wishlist = require("../models/Wishlist");
const { authenticate } = require("../middleware/auth");

// GET /api/wishlist
router.get("/", authenticate, async (req, res) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });
    if (!wl) wl = { products: [] };
    res.json(wl.products || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/wishlist/:productId — toggle
router.post("/:productId", authenticate, async (req, res) => {
  try {
    let wl = await Wishlist.findOne({ user: req.user._id });

    if (!wl) {
      wl = await Wishlist.create({ user: req.user._id, products: [req.params.productId] });
    } else {
      const idx = wl.products.findIndex((p) => p.toString() === req.params.productId);
      if (idx >= 0) {
        wl.products.splice(idx, 1); // remove
      } else {
        wl.products.push(req.params.productId); // add
      }
      await wl.save();
    }

    res.json(wl.products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
