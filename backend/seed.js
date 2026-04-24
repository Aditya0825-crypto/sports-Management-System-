const User = require("./models/User");
const Product = require("./models/Product");
const Shop = require("./models/Shop");
const Order = require("./models/Order");
const DeliveryJob = require("./models/DeliveryJob");
const Promotion = require("./models/Promotion");
const Dispute = require("./models/Dispute");
const Setting = require("./models/Setting");
const Courier = require("./models/Courier");
const MessageThread = require("./models/Message");
const Rental = require("./models/Rental");

const img = (q, sig) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=800&q=70&sig=${sig}`;

module.exports = async function seed() {
  // --- Users (password: "password123" for all) ---
  const customer = await User.create({ name: "Aarav Mehta", email: "customer@demo.com", password: "password123", role: "customer", phone: "+1 555 0149", address: "221B Athletic Lane, Mumbai", rewardPoints: 1420 });
  const customer2 = await User.create({ name: "Sara Khan", email: "sara@demo.com", password: "password123", role: "customer" });
  const customer3 = await User.create({ name: "Liam Park", email: "liam@demo.com", password: "password123", role: "customer", status: "Suspended" });
  const customer4 = await User.create({ name: "Maya Singh", email: "maya@demo.com", password: "password123", role: "customer" });
  const customer5 = await User.create({ name: "Noah Kim", email: "noah@demo.com", password: "password123", role: "customer" });

  const shopOwner1 = await User.create({ name: "Rahul Verma", email: "shop@demo.com", password: "password123", role: "shop" });
  const shopOwner2 = await User.create({ name: "Daniel O.", email: "daniel@demo.com", password: "password123", role: "shop" });
  const shopOwner3 = await User.create({ name: "Priya N.", email: "priya@demo.com", password: "password123", role: "shop" });
  const shopOwner4 = await User.create({ name: "Mira S.", email: "mira@demo.com", password: "password123", role: "shop" });

  const deliveryUser = await User.create({ name: "Jay Patel", email: "delivery@demo.com", password: "password123", role: "delivery" });
  const adminUser = await User.create({ name: "Admin", email: "admin@demo.com", password: "password123", role: "admin" });

  // --- Shops ---
  const s1 = await Shop.create({ name: "Boundary Sports", owner: shopOwner1._id, ownerName: "Rahul Verma", productCount: 64, rating: 4.8, status: "Active", bio: "Premium cricket and outdoor gear since 2018.", city: "Mumbai, India", hours: "Mon-Sat 9AM-9PM", followers: 1200 });
  const s2 = await Shop.create({ name: "Goal Gear", owner: shopOwner3._id, ownerName: "Priya N.", productCount: 41, rating: 4.6, status: "Active", city: "Delhi, India" });
  const s3 = await Shop.create({ name: "Iron House", owner: shopOwner2._id, ownerName: "Daniel O.", productCount: 88, rating: 4.9, status: "Active", city: "Mumbai, India" });
  const s4 = await Shop.create({ name: "Ace Courts", owner: shopOwner4._id, ownerName: "Mira S.", productCount: 27, rating: 4.5, status: "Pending" });
  await Shop.create({ name: "Stride Co.", owner: shopOwner1._id, ownerName: "Kenji T.", productCount: 53, rating: 4.7, status: "Active" });
  await Shop.create({ name: "Trail Riders", owner: shopOwner1._id, ownerName: "Elena R.", productCount: 36, rating: 4.6, status: "Active" });
  await Shop.create({ name: "Knockout Gear", owner: shopOwner1._id, ownerName: "Marcus J.", productCount: 19, rating: 4.8, status: "Suspended" });

  // --- Products ---
  const products = await Product.insertMany([
    { name: "Pro Cricket Bat — English Willow", category: "Cricket", price: 149, rentPerDay: 9, rating: 4.8, reviews: 312, shop: s1._id, shopName: "Boundary Sports", stock: 24, image: img("photo-1531415074968-036ba1b575da", 1), badge: "Bestseller", description: "Hand-crafted Grade-1 English willow bat with a thick edge profile, mid-blade sweet spot and premium cane handle." },
    { name: "Match Football — Size 5", category: "Football", price: 39, rentPerDay: 4, rating: 4.7, reviews: 980, shop: s2._id, shopName: "Goal Gear", stock: 80, image: img("photo-1614632537190-23e4146777db", 2), description: "FIFA-quality match ball with thermo-bonded panels." },
    { name: "Adjustable Dumbbell Set 5-25kg", category: "Gym", price: 229, rating: 4.9, reviews: 540, shop: s3._id, shopName: "Iron House", stock: 12, image: img("photo-1517836357463-d25dfeac3438", 3), badge: "New", description: "Replace 15 pairs of dumbbells. Twist-dial adjusts from 5kg to 25kg." },
    { name: "Carbon Tennis Racket", category: "Tennis", price: 119, rentPerDay: 6, rating: 4.6, reviews: 187, shop: s4._id, shopName: "Ace Courts", stock: 18, image: img("photo-1554068865-24cecd4e34b8", 4), description: "100% graphite frame, 300g unstrung." },
    { name: "Trail Running Shoes", category: "Running", price: 99, rating: 4.5, reviews: 421, shopName: "Stride Co.", stock: 60, image: img("photo-1542291026-7eec264c27ff", 5), description: "Aggressive lugged outsole, breathable mesh upper." },
    { name: "Yoga Mat — 6mm Pro", category: "Yoga", price: 35, rating: 4.7, reviews: 612, shopName: "Zen Athletics", stock: 140, image: img("photo-1540206395-68808572332f", 6), description: "Eco TPE 6mm mat with alignment markers." },
    { name: "Mountain Bike Helmet", category: "Cycling", price: 79, rentPerDay: 3, rating: 4.6, reviews: 233, shopName: "Trail Riders", stock: 32, image: img("photo-1485965120184-e220f721d03e", 7), description: "MIPS protection, 18 vents." },
    { name: "Boxing Gloves — 14oz", category: "Boxing", price: 65, rating: 4.8, reviews: 198, shopName: "Knockout Gear", stock: 22, image: img("photo-1517438476312-10d79c077509", 8), description: "Multi-layer foam, full-grain leather." },
    { name: "Pro Basketball — Indoor/Outdoor", category: "Basketball", price: 49, rating: 4.7, reviews: 410, shopName: "Court Kings", stock: 55, image: img("photo-1546519638-68e109498ffc", 9), description: "Composite leather, deep channels." },
    { name: "Swim Goggles — Anti-Fog", category: "Swimming", price: 24, rating: 4.5, reviews: 305, shopName: "Aqua Lane", stock: 95, image: img("photo-1530549387789-4c1017266635", 10), description: "Wide field of vision, mirrored UV lens." },
    { name: "Resistance Bands — Set of 5", category: "Gym", price: 29, rating: 4.8, reviews: 1102, shop: s3._id, shopName: "Iron House", stock: 220, image: img("photo-1571902943202-507ec2618e8f", 11), badge: "Deal", description: "Color-coded loops from 10 to 50 lb." },
    { name: "Skateboard — 8.0 Maple Deck", category: "Skating", price: 89, rating: 4.6, reviews: 142, shopName: "Curb Cult", stock: 18, image: img("photo-1520642413789-2bd6770d59e3", 12), description: "7-ply Canadian maple, ABEC-7 bearings." },
  ]);

  // --- Orders ---
  await Order.insertMany([
    { orderId: "ORD-1042", customer: customer._id, customerName: "Aarav Mehta", itemCount: 2, total: 188, status: "In transit", date: "2026-04-21", shopName: "Boundary Sports", items: [], trackingSteps: [{ label: "Order placed", time: "10:14 AM", done: true },{ label: "Shop accepted", time: "10:21 AM", done: true },{ label: "Picked up", time: "10:48 AM", done: true },{ label: "In transit", time: "Now", done: true, active: true },{ label: "Delivered", time: "—", done: false }] },
    { orderId: "ORD-1041", customer: customer2._id, customerName: "Sara Khan", itemCount: 1, total: 39, status: "Delivered", date: "2026-04-20", shopName: "Goal Gear", items: [] },
    { orderId: "ORD-1040", customer: customer3._id, customerName: "Liam Park", itemCount: 3, total: 412, status: "Accepted", date: "2026-04-20", shopName: "Iron House", items: [] },
    { orderId: "ORD-1039", customer: customer4._id, customerName: "Maya Singh", itemCount: 1, total: 119, status: "Pending", date: "2026-04-19", shopName: "Ace Courts", items: [] },
    { orderId: "ORD-1038", customer: customer5._id, customerName: "Noah Kim", itemCount: 2, total: 134, status: "Picked up", date: "2026-04-19", shopName: "Stride Co.", items: [] },
    { orderId: "ORD-1037", customer: customer2._id, customerName: "Zara Ali", itemCount: 1, total: 35, status: "Delivered", date: "2026-04-18", shopName: "Zen Athletics", items: [] },
    { orderId: "ORD-1036", customer: customer._id, customerName: "Omar B.", itemCount: 4, total: 256, status: "Delivered", date: "2026-04-17", shopName: "Boundary Sports", items: [] },
    { orderId: "ORD-1035", customer: customer3._id, customerName: "Ivy L.", itemCount: 1, total: 79, status: "Cancelled", date: "2026-04-17", shopName: "Trail Riders", items: [] },
  ]);

  // --- Delivery Jobs ---
  await DeliveryJob.insertMany([
    { jobId: "DLV-552", from: "Boundary Sports", to: "Andheri West", distance: "3.2 km", payout: 6.5, status: "Available", customer: "Aarav M." },
    { jobId: "DLV-551", from: "Iron House", to: "Bandra", distance: "5.8 km", payout: 9.0, status: "Available", customer: "Liam P." },
    { jobId: "DLV-550", from: "Goal Gear", to: "Powai", distance: "7.1 km", payout: 11.2, status: "Assigned", customer: "Sara K.", courier: deliveryUser._id },
    { jobId: "DLV-549", from: "Ace Courts", to: "Worli", distance: "4.4 km", payout: 7.8, status: "Delivered", customer: "Maya S." },
    { jobId: "DLV-548", from: "Stride Co.", to: "Juhu", distance: "2.9 km", payout: 5.4, status: "Delivered", customer: "Noah K." },
    { jobId: "DLV-547", from: "Zen Athletics", to: "Colaba", distance: "9.6 km", payout: 14.2, status: "Available", customer: "Zara A." },
  ]);

  // --- Promotions ---
  await Promotion.insertMany([
    { promoId: "PR-01", title: "Spring Cricket Sale", discount: "20% off", scope: "Cricket category", status: "Active", ends: "2026-05-15" },
    { promoId: "PR-02", title: "Free shipping over $99", discount: "Free ship", scope: "All shops", status: "Active", ends: "2026-12-31" },
    { promoId: "PR-03", title: "Gym starter bundle", discount: "$30 off", scope: "Iron House", status: "Scheduled", ends: "2026-06-01" },
  ]);

  // --- Disputes ---
  await Dispute.insertMany([
    { disputeId: "DSP-22", reason: "Item not delivered", filedBy: "Aarav M.", orderId: "ORD-1042", status: "Open" },
    { disputeId: "DSP-21", reason: "Damaged on arrival", filedBy: "Sara K.", orderId: "ORD-1037", status: "Open" },
    { disputeId: "DSP-20", reason: "Late refund", filedBy: "Liam P.", orderId: "ORD-1031", status: "Open" },
    { disputeId: "DSP-19", reason: "Wrong item shipped", filedBy: "Maya S.", orderId: "ORD-1029", status: "Resolved" },
  ]);

  // --- Couriers ---
  await Courier.insertMany([
    { courierId: "C-101", name: "Jay Patel", zone: "Andheri", rating: 4.9, deliveries: 1204, status: "Online", user: deliveryUser._id },
    { courierId: "C-102", name: "Priya R.", zone: "Bandra", rating: 4.8, deliveries: 882, status: "Online" },
    { courierId: "C-103", name: "Marcus L.", zone: "Worli", rating: 4.7, deliveries: 540, status: "Offline" },
    { courierId: "C-104", name: "Hana M.", zone: "Powai", rating: 4.6, deliveries: 312, status: "Online" },
    { courierId: "C-105", name: "Yusuf O.", zone: "Colaba", rating: 4.9, deliveries: 1890, status: "Online" },
  ]);

  // --- Rentals ---
  await Rental.insertMany([
    { rentalId: "RNT-09", customer: customer._id, customerName: "Aarav Mehta", productName: "Carbon Tennis Racket", days: 3, pricePerDay: 6, totalPrice: 18, status: "Active", shopName: "Ace Courts", dueDate: new Date(Date.now() + 2 * 86400000) },
    { rentalId: "RNT-08", customer: customer._id, customerName: "Aarav Mehta", productName: "Mountain Bike Helmet", days: 7, pricePerDay: 3, totalPrice: 21, status: "Active", shopName: "Trail Riders", dueDate: new Date(Date.now() + 1 * 86400000) },
  ]);

  // --- Messages ---
  await MessageThread.insertMany([
    { participants: [customer._id, shopOwner1._id], shopName: "Boundary Sports", customerName: "Aarav Mehta", lastMessage: "Your bat will ship today by 6 PM.", unread: 1, messages: [
      { from: "shop", text: "Hi! Your Pro Cricket Bat is ready.", time: "9:21 AM" },
      { from: "me", text: "Great — when will it ship?", time: "9:24 AM" },
      { from: "shop", text: "Your bat will ship today by 6 PM.", time: "9:25 AM" },
    ]},
    { participants: [customer._id, shopOwner2._id], shopName: "Iron House", customerName: "Aarav Mehta", lastMessage: "Yes, the dumbbells include a tray.", unread: 0, messages: [
      { from: "shop", text: "Yes, the dumbbells include a tray.", time: "Yesterday" },
    ]},
    { participants: [customer._id, shopOwner3._id], shopName: "Goal Gear", customerName: "Aarav Mehta", lastMessage: "Thanks for the order!", unread: 0, messages: [
      { from: "shop", text: "Thanks for the order!", time: "Mon" },
    ]},
  ]);

  // --- Settings ---
  await Setting.create({ key: "platform" });

  console.log("  ✓ Seeded users, shops, products, orders, jobs, promotions, disputes, couriers, rentals, messages, settings");
};
