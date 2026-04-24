const router = require("express").Router();
const Promotion = require("../models/Promotion");
const Shop = require("../models/Shop");
const { emitRealtime } = require("../realtime");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "shop") {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop) return res.json([]);
      filter.shop = shop._id;
    }
    const promos = await Promotion.find(filter).sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/", authenticate, authorize("shop", "admin"), async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.user._id });
    if (req.user.role === "shop" && !shop) {
      return res.status(400).json({ message: "No shop found for this user" });
    }
    const promo = await Promotion.create({
      ...req.body,
      promoId: `PR-${Date.now().toString().slice(-4)}`,
      shop: shop ? shop._id : null,
    });
    emitRealtime("promotions:updated", { reason: "created" });
    emitRealtime("analytics:updated", { reason: "promotion-created" });
    res.status(201).json(promo);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id", authenticate, async (req, res) => {
  try {
    const promo = await Promotion.findById(req.params.id);
    if (!promo) return res.status(404).json({ message: "Promotion not found" });

    if (req.user.role === "shop") {
      const shop = await Shop.findOne({ owner: req.user._id });
      if (!shop || !promo.shop || String(promo.shop) !== String(shop._id)) {
        return res.status(403).json({ message: "Not allowed to modify this promotion" });
      }
    }

    Object.assign(promo, req.body);
    await promo.save();
    emitRealtime("promotions:updated", { reason: "updated", promotionId: promo._id });
    emitRealtime("analytics:updated", { reason: "promotion-updated" });
    res.json(promo);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
