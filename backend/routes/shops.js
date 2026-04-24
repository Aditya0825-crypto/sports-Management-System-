const router = require("express").Router();
const Shop = require("../models/Shop");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const shops = await Shop.find().sort({ createdAt: -1 });
    res.json(shops);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/mine", authenticate, authorize("shop"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (!shop) return res.status(404).json({ message: "No shop found" });
    res.json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    Object.assign(shop, req.body);
    await shop.save();
    res.json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id/status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    shop.status = status;
    await shop.save();
    res.json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
