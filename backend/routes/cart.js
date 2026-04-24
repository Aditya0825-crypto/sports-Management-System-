const router = require("express").Router();
const Cart = require("../models/Cart");
const { authenticate } = require("../middleware/auth");

// GET /api/cart
router.get("/", authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart — add item
router.post("/", authenticate, async (req, res) => {
  try {
    const { productId, qty = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, qty }] });
    } else {
      const existing = cart.items.find((i) => i.product.toString() === productId);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.items.push({ product: productId, qty });
      }
      await cart.save();
    }

    cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/cart/:productId — update qty
router.patch("/:productId", authenticate, async (req, res) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      const item = cart.items.find((i) => i.product.toString() === req.params.productId);
      if (item) item.qty = qty;
    }

    await cart.save();
    const populated = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart/:productId — remove item
router.delete("/:productId", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();

    const populated = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/cart — clear cart
router.delete("/", authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
