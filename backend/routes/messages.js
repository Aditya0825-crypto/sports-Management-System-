const router = require("express").Router();
const MessageThread = require("../models/Message");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, async (req, res) => {
  try {
    const threads = await MessageThread.find({ participants: req.user._id }).sort({ updatedAt: -1 });
    const result = threads.map((t) => ({
      _id: t._id,
      id: t._id,
      shopName: t.shopName,
      customerName: t.customerName,
      lastMessage: t.lastMessage,
      unread: t.unread,
      // Backward-compatible keys
      shop: t.shopName,
      customer: t.customerName,
      last: t.lastMessage,
    }));
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get("/:threadId", authenticate, async (req, res) => {
  try {
    const thread = await MessageThread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    thread.unread = 0;
    await thread.save();
    res.json(thread.messages);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/:threadId", authenticate, async (req, res) => {
  try {
    const { text } = req.body;
    const thread = await MessageThread.findById(req.params.threadId);
    if (!thread) return res.status(404).json({ message: "Thread not found" });
    const fromType = req.user.role === "shop" ? "shop" : "me";
    const msg = { from: fromType, senderId: req.user._id, text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    thread.messages.push(msg);
    thread.lastMessage = text;
    thread.unread = (thread.unread || 0) + 1;
    await thread.save();
    res.json(msg);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post("/", authenticate, async (req, res) => {
  try {
    const { participantId, shopName, text } = req.body;
    const thread = await MessageThread.create({
      participants: [req.user._id, participantId], shopName: shopName || "",
      customerName: req.user.name, lastMessage: text || "",
      messages: text ? [{ from: "me", senderId: req.user._id, text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }] : [],
    });
    res.status(201).json(thread);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
