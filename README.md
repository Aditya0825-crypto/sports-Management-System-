# 🏆 SportifyHub  
### Real-Time Sports Management & Commerce Platform

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js" />
  <img src="https://img.shields.io/badge/Database-MongoDB-darkgreen?style=for-the-badge&logo=mongodb" />
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-black?style=for-the-badge&logo=socket.io" />
  <img src="https://img.shields.io/badge/UI-TailwindCSS-cyan?style=for-the-badge&logo=tailwindcss" />
</p>

<p align="center">
  <b>All-in-One Smart Platform for Sports Businesses, Customers & Delivery Operations</b>
</p>

---

## 📌 Overview

**SportifyHub** is a modern full-stack sports management ecosystem designed to digitize and streamline sports product sales, rentals, deliveries, analytics, and communication.

It provides dedicated dashboards for:

✅ Customers  
✅ Shop Owners  
✅ Delivery Partners  
✅ Admins  

With real-time updates, smart order tracking, inventory management, analytics, and secure authentication.

---

# 🚀 Key Features

## 👤 Customer Panel
- Browse sports products
- Add to cart / checkout
- Rent sports equipment
- Wishlist system
- Track orders live
- Chat with shop owners
- Order history

## 🏪 Shop Owner Panel
- Product CRUD management
- Manage incoming orders
- Handle rentals
- Promotions & offers
- Sales analytics dashboard
- Customer communication

## 🚚 Delivery Partner Panel
- Accept delivery requests
- Live delivery status updates
- Earnings history
- Delivery dashboard

## 🛡️ Admin Panel
- Manage users & shops
- Handle disputes
- Manage couriers
- Global platform analytics
- Settings & controls

## ⚡ Real-Time Functionalities
- Instant order updates
- Live promotions
- Rental status changes
- Dashboard analytics refresh

---

# 🛠️ Tech Stack

## 🎨 Frontend

| Technology | Purpose |
|----------|---------|
| React.js | UI Development |
| TypeScript | Type Safety |
| Vite | Fast Build Tool |
| Tailwind CSS | Styling |
| ShadCN UI | Modern Components |
| Axios | API Requests |
| React Router | Navigation |
| Socket.IO Client | Real-time Sync |

---

## ⚙️ Backend

| Technology | Purpose |
|----------|---------|
| Node.js | Runtime Environment |
| Express.js | REST API Server |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Socket.IO | Real-time Events |
| Multer | File Uploads |

---

# 📂 Project Structure

```bash
SportifyHub/
│── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── assets/
│
│── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/

###  4) Setup and Installation

## Prerequisites
- Node.js 18+ (recommended LTS)
- npm 9+
- MongoDB Atlas or local MongoDB instance

### Step 1: Clone / Open Project
- Open this folder in Cursor/VS Code:
  - `sportifyhub-your-all-in-one-sports-hub-main`

### Step 2: Install dependencies

Frontend:
```bash
cd frontend
npm install
```

Backend:
```bash
cd backend
npm install
```

Backend:
```bash
cd backend
npm install
```

### Step 3: Configure environment variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

> Security note: never commit real credentials or production secrets into source control.

### Step 4: Run development servers

Backend (terminal 1):
```bash
cd backend
npm run dev
```

Frontend (terminal 2):
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:8080` and proxies API/WebSocket traffic to backend `http://localhost:5000`.

---

## 5) Available Scripts

### Frontend (`frontend/package.json`)
- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run build:all` - Build frontend + backend build validation
- `npm run preview` - Preview production build
- `npm run test` - Run tests once
- `npm run test:watch` - Watch tests
- `npm run lint` - Run ESLint

### Backend (`backend/package.json`)
- `npm run dev` - Start backend with nodemon
- `npm run start` - Start backend with node
- `npm run build` - Validate backend JS syntax (`scripts/build.js`)
- `npm run build:check` - Same as build
- `npm run seed` - Seed sample data

---

## 6) API Overview

Base URL (dev): `http://localhost:5000/api`

Main route groups:
- `/auth`
- `/products`
- `/orders`
- `/rentals`
- `/cart`
- `/wishlist`
- `/messages`
- `/delivery-jobs`
- `/shops`
- `/users`
- `/promotions`
- `/disputes`
- `/settings`
- `/analytics`
- `/couriers`
- `/upload`

Health check:
- `GET /api/health`

---

## 7) Real-Time Events (Socket.IO)

Transport endpoint:
- `/socket.io` (proxied by Vite in development)

Server emits:
- `orders:updated`
- `rentals:updated`
- `promotions:updated`
- `analytics:updated`

Frontend subscribers:
- App state refresh for orders
- Rentals page refresh
- Promotions page refresh
- Analytics page refresh

---

## 8) Build and Verification

### Quick full build
```bash
cd frontend
npm run build:all
```

This validates:
1. Frontend production bundle
2. Backend runtime JS syntax checks

---

## 9) Troubleshooting

### Backend cannot connect to MongoDB
- Verify `MONGODB_URI` in `backend/.env`
- If using Atlas, add your current IP to IP access list
- Ensure database user/password are correct

### Login/auth issues
- Verify `JWT_SECRET` is set
- Clear local storage and sign in again

### Realtime updates not appearing
- Ensure backend is running
- Ensure frontend dev server is running with Vite proxy
- Check browser console/network for `/socket.io` connection errors
- Restart frontend/backend after dependency or socket config changes

### Port conflict
- Change backend `PORT` in `.env`
- Update frontend proxy target in `frontend/vite.config.ts` if needed

---

## 10) Suggested Next Improvements

- Add refresh-token based auth
- Add pagination/filtering on large tables
- Add automated API tests
- Add Docker setup for one-command local run
- Add CI pipeline for lint/build/test

---

## 11) License

Use this project for learning, prototyping, and internal development unless a separate license is added.

