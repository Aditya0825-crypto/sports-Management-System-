const mongoose = require("mongoose");

const singleMsgSchema = new mongoose.Schema(
  {
    from: { type: String, enum: ["me", "shop"], required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    text: { type: String, required: true },
    time: { type: String, default: "Now" },
  },
  { _id: false }
);

const messageThreadSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shopName: { type: String, default: "" },
    customerName: { type: String, default: "" },
    lastMessage: { type: String, default: "" },
    unread: { type: Number, default: 0 },
    messages: [singleMsgSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("MessageThread", messageThreadSchema);
