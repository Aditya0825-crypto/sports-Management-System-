const router = require("express").Router();
const Setting = require("../models/Setting");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: "platform" });
    if (!settings) settings = await Setting.create({ key: "platform" });
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    let settings = await Setting.findOne({ key: "platform" });
    if (!settings) settings = await Setting.create({ key: "platform" });
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
