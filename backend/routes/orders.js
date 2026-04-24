const router = require("express").Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Shop = require("../models/Shop");
const DeliveryJob = require("../models/DeliveryJob");
const { emitRealtime } = require("../realtime");
const { authenticate, authorize } = require("../middleware/auth");

// Counter for order IDs
let orderCounter = 1050;

// GET /api/orders
router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    } else if (req.user.role === "shop") {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (shop) filter.shopName = shop.name;
    }
    // admin sees all

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders — create order from cart (customer)
router.post("/", authenticate, authorize("customer"), async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Group items by shop
    const shopGroups = {};
    for (const item of cart.items) {
      const shopName = item.product.shopName || "Unknown Shop";
      if (!shopGroups[shopName]) shopGroups[shopName] = [];
      shopGroups[shopName].push(item);
    }

    const createdOrders = [];

    for (const [shopName, items] of Object.entries(shopGroups)) {
      orderCounter++;
      const orderId = `ORD-${orderCounter}`;
      const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

      const order = await Order.create({
        orderId,
        customer: req.user._id,
        customerName: req.user.name,
        items: items.map((i) => ({
          product: i.product._id,
          productName: i.product.name,
          qty: i.qty,
          price: i.product.price,
        })),
        itemCount: items.reduce((s, i) => s + i.qty, 0),
        total,
        shopName,
        status: "Pending",
        trackingSteps: [
          { label: "Order placed", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), done: true, active: true },
          { label: "Shop accepted", time: "—", done: false },
          { label: "Picked up", time: "—", done: false },
          { label: "In transit", time: "—", done: false },
          { label: "Delivered", time: "—", done: false },
        ],
      });

      // Decrease stock
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.qty },
        });
      }

      // Create delivery job
      const jobCounter = Date.now().toString().slice(-3);
      await DeliveryJob.create({
        jobId: `DLV-${jobCounter}`,
        from: shopName,
        to: req.user.address || "Customer Address",
        distance: `${(Math.random() * 8 + 2).toFixed(1)} km`,
        payout: Number((total * 0.05 + 2).toFixed(2)),
        status: "Available",
        customer: req.user.name,
        order: order._id,
      });

      createdOrders.push(order);
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    emitRealtime("orders:updated", { reason: "created" });
    emitRealtime("analytics:updated", { reason: "order-created" });

    res.status(201).json(createdOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status — update order status
router.patch("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    // Update tracking steps
    const statusMap = {
      Pending: 0,
      Accepted: 1,
      "Picked up": 2,
      "In transit": 3,
      Delivered: 4,
    };
    const stepIndex = statusMap[status];
    if (stepIndex !== undefined && order.trackingSteps.length > 0) {
      order.trackingSteps.forEach((s, i) => {
        s.done = i <= stepIndex;
        s.active = i === stepIndex;
        if (i === stepIndex) {
          s.time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }
      });
    }

    await order.save();
    emitRealtime("orders:updated", { reason: "status-changed", orderId: order._id });
    emitRealtime("analytics:updated", { reason: "order-status-changed" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
