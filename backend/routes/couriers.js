const router = require("express").Router();
const Courier = require("../models/Courier");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const couriers = await Courier.find().sort({ deliveries: -1 });
    res.json(couriers);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
