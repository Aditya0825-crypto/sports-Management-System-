const router = require("express").Router();
const Dispute = require("../models/Dispute");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const dispute = await Dispute.create({
      ...req.body,
      disputeId: `DSP-${Date.now().toString().slice(-4)}`,
      filedBy: req.user.name,
      filedByUser: req.user._id,
    });
    res.status(201).json(dispute);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id/resolve", authenticate, authorize("admin"), async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: "Dispute not found" });
    dispute.status = "Resolved";
    await dispute.save();
    res.json(dispute);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
