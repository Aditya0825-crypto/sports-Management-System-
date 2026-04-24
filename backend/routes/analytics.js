const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Shop = require("../models/Shop");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/shop", authenticate, authorize("shop"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) {
      return res.json({
        revenue: 0,
        orders: 0,
        pageViews: 0,
        newCustomers: 0,
        topProducts: [],
        salesWeekly: [0, 0, 0, 0, 0, 0, 0],
        visitsWeekly: [0, 0, 0, 0, 0, 0, 0],
      });
    }
    const orders = await Order.find({ shopName: shop.name });
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const topProducts = await Product.find({ shop: shop._id }).sort({ reviews: -1 }).limit(4);
    const pageViews = Math.floor(Math.random() * 15000) + 5000;
    const newCustomers = new Set(orders.map((o) => o.customerName)).size;
    const salesWeekly = [40, 65, 50, 80, 72, 95, 88];
    const visitsWeekly = [120, 180, 160, 240, 220, 300, 260];

    res.json({
      revenue,
      orders: orders.length,
      pageViews,
      newCustomers,
      topProducts: topProducts.map((p) => ({ name: p.name, sold: p.reviews, revenue: p.price * p.reviews })),
      salesWeekly,
      visitsWeekly,
      // Backward compatibility for any old UI keys
      views: pageViews,
      customers: newCustomers,
      sales: salesWeekly,
      visits: visitsWeekly,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/admin", authenticate, authorize("admin"), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = (await Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]))[0]?.total || 0;
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments({ status: "Active" });
    res.json({
      gmv: totalRevenue, users: totalUsers, shops: totalShops, orders: totalOrders,
      revenueChart: [42000, 51000, 48000, 62000, 58000, 71000, 64000],
      usersChart: [12000, 13200, 14100, 15400, 16200, 17500, 18400],
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
