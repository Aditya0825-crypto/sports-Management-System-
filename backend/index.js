require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { setIO } = require("./realtime");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) socket.user = user;
    next();
  } catch (_err) {
    next();
  }
});

io.on("connection", (socket) => {
  if (socket.user) {
    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${socket.user._id}`);
  }
});

setIO(io);

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --------------- Routes ---------------
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/rentals", require("./routes/rentals"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/delivery-jobs", require("./routes/deliveryJobs"));
app.use("/api/shops", require("./routes/shops"));
app.use("/api/users", require("./routes/users"));
app.use("/api/promotions", require("./routes/promotions"));
app.use("/api/disputes", require("./routes/disputes"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/couriers", require("./routes/couriers"));
app.use("/api/upload", require("./routes/upload"));

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// --------------- Connect & Start ---------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Auto-seed if DB is empty
    const count = await User.countDocuments();
    if (count === 0) {
      console.log("🌱 Empty database detected — running seed…");
      await require("./seed")();
      console.log("🌱 Seed complete");
    }

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
