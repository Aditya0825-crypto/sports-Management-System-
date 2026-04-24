const router = require("express").Router();
const DeliveryJob = require("../models/DeliveryJob");
const { authenticate, authorize } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "delivery") {
      filter.$or = [{ status: "Available" }, { courier: req.user._id }];
    }
    const jobs = await DeliveryJob.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id/accept", authenticate, authorize("delivery"), async (req, res) => {
  try {
    const job = await DeliveryJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.status = "Assigned";
    job.courier = req.user._id;
    await job.save();
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.patch("/:id/status", authenticate, authorize("delivery"), async (req, res) => {
  try {
    const { status } = req.body;
    const job = await DeliveryJob.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.status = status;
    await job.save();
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
