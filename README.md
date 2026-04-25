# SportifyHub - Real-Time Sports Management Platform

SportifyHub is a full-stack sports commerce and operations platform with role-based dashboards for:
- Customers
- Shop owners
- Delivery partners
- Admins

It supports products, cart/checkout, orders, rentals, promotions, analytics, messaging, and real-time updates using Socket.IO.

---

## 1) Project Structure

```text
sportifyhub-your-all-in-one-sports-hub-main/
  frontend/   # Vite + React + TypeScript dashboard app
  backend/    # Node.js + Express + MongoDB + Socket.IO API server
```

### Frontend (`frontend`)
- React 18 + TypeScript
- Vite bundler
- Tailwind CSS + shadcn/ui components
- Axios API layer
- Socket.IO client for live updates

### Backend (`backend`)
- Express REST API
- Mongoose models for MongoDB
- JWT auth + role-based authorization
- Socket.IO server for realtime event broadcasting

---

## 2) Features

### Authentication and Roles
- Sign up / sign in with role selection
- JWT-based session
- Protected dashboard routes by role

### Customer
- Browse products
- Add/remove cart items
- Place orders
- Create/manage rentals
- Wishlist
- Chat with shop owners
- Track order status updates

### Shop Owner
- Product management
- Incoming order handling
- Rental operations
- Promotion creation and status updates
- Analytics dashboard
- Customer messaging

### Delivery
- View and accept jobs
- Update delivery status
- Delivery history and earnings

### Admin
- Manage users and shops
- View platform orders/disputes/couriers
- Admin analytics and settings

### Real-Time
- Orders update instantly
- Rentals update instantly
- Promotions update instantly
- Analytics refreshes on business events

---

## 3) Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Socket.IO
- Multer (upload endpoint)

---

## 4) Setup and Installation

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

