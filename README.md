# MHK Travels — Hajj & Umrah Tour Operator Platform

A complete, production-ready full-stack web application for Sri Lanka's trusted Hajj & Umrah tour operator. Built with the **PENN stack** (PostgreSQL, Express.js, Next.js, Node.js) featuring a modern glassmorphism design, comprehensive booking flow, PayHere payment integration, and a full-featured admin panel.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Design System](#design-system)
- [Testing Credentials](#testing-credentials)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

<a id="overview"></a>
## 🕌 Overview

MHK Travels is a full-stack Hajj & Umrah booking platform designed for Sri Lankan pilgrims. It provides:

- A modern, glassmorphism-styled public website with package browsing and filtering
- Secure authentication and user dashboards
- A complete booking flow with 20% advance payment via PayHere
- A comprehensive admin panel for managing packages, bookings, users, payments, and analytics

The platform is **MRCA (Ministry of Muslim Religious and Cultural Affairs) compliant** and integrates with Sri Lanka's Central Bank-approved PayHere payment gateway.

---

<a id="features"></a>
## ✨ Features

### 🌐 Public Website

- **Home Page** — hero section, trust stats, featured packages, CTA
- **Umrah Packages** — glass morphism filters (month, duration, price, hotel proximity)
- **Hajj Packages** — same filter system
- **Package Detail** — hotels, itinerary, inclusions, sticky booking card
- **About** — mission, vision, timeline, values
- **Services** — 8 comprehensive service cards
- **Contact** — form, team contacts, office hours, map
- **FAQ** — search + 10 categories (28 questions)
- **Terms & Conditions** — 11 detailed sections
- **Privacy Policy** — 11 sections + trust badges

### 🔐 Authentication

- JWT-based authentication with bcrypt password hashing
- Login, Register, Forgot Password flows
- "Remember Me" functionality (localStorage vs sessionStorage)
- Split-screen design with social login UI (Google, Facebook, Apple)
- Password strength meter with real-time feedback

### 👤 User Dashboard

- Overview with stats and recent bookings
- My Bookings list with status filters and search
- Booking Detail with payment timeline, travellers, and actions
- Upcoming Journey with countdown timers
- Payment History
- Notifications center
- Profile management
- 20% advance payment via PayHere

### 📋 Booking Flow

- Multi-step booking form with traveller details
- Auto-generated booking references (`MHK-UMR-YYYYMM-XXXX`)
- Auto-calculated 20% advance and 80% balance
- PayHere payment integration (sandbox + live)
- Payment success/failure pages
- Booking cancellation with refund policy
- Booking deletion for unpaid/cancelled bookings

### 🛠️ Admin Panel (13 Pages)

- **Dashboard** — stats grid, booking breakdown, financial summary
- **Packages** — CRUD operations, filters, search
- **Create/Edit Package** — hotels, inclusions, itinerary builder
- **Bookings** — status filters and update workflow
- **Travellers** — registry across all bookings
- **Users** — management with role assignment
- **Payments** — monitoring with stats grid
- **Reports** — revenue trends, top packages, CSV export
- **Reviews** — approve/hide/delete management
- **Notifications** — compose form and sent history
- **Settings** — 5 tabs (Company, Contact, Booking, Payment, Email)

### 🎨 Design System

- Glassmorphism throughout (translucent cards, backdrop blur)
- Framer Motion animations (fade, stagger, hover, spring)
- Material Symbols icons
- Two accent themes — Teal for users, Gold/Amber for admin
- Fully responsive (mobile, tablet, desktop)

---

<a id="tech-stack"></a>
## 🚀 Tech Stack

### Frontend

| Tech | Version | Purpose |
| :--- | :--- | :--- |
| Next.js | 14 | React framework with App Router |
| React | 18 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations |
| Zustand | 4 | State management |
| Axios | 1 | HTTP client |
| React Hot Toast | 2 | Notifications |
| Lucide React | 0.4 | Icons (fallback) |

### Backend

| Tech | Version | Purpose |
| :--- | :--- | :--- |
| Node.js | 18+ | Runtime |
| Express.js | 4 | Web framework |
| TypeScript | 5 | Type safety |
| Prisma ORM | 5 | Database access |
| PostgreSQL | 14+ | Database |
| JWT | 9 | Authentication |
| bcrypt | 5 | Password hashing |
| express-validator | 7 | Request validation |
| tsx | 4 | TypeScript execution |

### Integrations

| Service | Purpose |
| :--- | :--- |
| PayHere | Payment gateway (sandbox + live) |

---

<a id="screenshots"></a>
## 📸 Screenshots

> Screenshots will be added after the project is deployed to production.

---

<a id="project-structure"></a>
## 📁 Project Structure

```text
mhk_travel_new/
├── app/                              # Next.js App Router
│   ├── (public)/                     # Public pages (no auth)
│   │   ├── page.tsx                  # Home
│   │   ├── umrah/page.tsx            # Umrah packages
│   │   ├── hajj/page.tsx             # Hajj packages
│   │   ├── package/[id]/page.tsx     # Package detail
│   │   ├── about/page.tsx            # About us
│   │   ├── services/page.tsx         # Services
│   │   ├── contact/page.tsx          # Contact
│   │   ├── faq/page.tsx              # FAQ
│   │   ├── terms/page.tsx            # Terms & Conditions
│   │   └── privacy/page.tsx          # Privacy Policy
│   ├── (auth)/                       # Authentication
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (user)/                       # User dashboard (protected)
│   │   ├── layout.tsx                # Shared layout with sidebar
│   │   ├── dashboard/page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx              # Bookings list
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Booking detail
│   │   │       ├── pay/page.tsx      # Payment page
│   │   │       ├── pay/success/page.tsx
│   │   │       └── pay/failed/page.tsx
│   │   ├── booking/[id]/page.tsx     # Booking form
│   │   ├── upcoming/page.tsx
│   │   └── payments/page.tsx
│   ├── (admin)/                      # Admin panel (protected)
│   │   ├── layout.tsx                # Shared admin layout
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── packages/
│   │       │   ├── page.tsx
│   │       │   ├── create/page.tsx
│   │       │   └── [id]/edit/page.tsx
│   │       ├── bookings/
│   │       │   ├── page.tsx
│   │       │   └── [id]/page.tsx
│   │       ├── travellers/page.tsx
│   │       ├── users/page.tsx
│   │       ├── payments/page.tsx
│   │       ├── reports/page.tsx
│   │       ├── reviews/page.tsx
│   │       ├── notifications/page.tsx
│   │       └── settings/page.tsx
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── providers.tsx                 # Context providers
├── components/
│   ├── ui/
│   │   ├── GlassSelect.tsx           # Custom dropdown
│   │   ├── GlassCheckbox.tsx         # Custom checkbox
│   │   ├── MotionDiv.tsx             # Animation utilities
│   │   └── SocialIcons.tsx           # Social login icons
│   ├── layout/
│   │   ├── Header.tsx                # Public header
│   │   ├── Footer.tsx                # Public footer
│   │   ├── UserSidebar.tsx           # User navigation
│   │   └── AdminSidebar.tsx          # Admin navigation
│   └── packages/
│       ├── PackageCard.tsx           # Reusable package card
│       └── PackageFilters.tsx        # Filter sidebar
├── hooks/
│   └── useAuth.ts                    # Auth state (Zustand)
├── lib/
│   └── api.ts                        # API client
├── types/
│   └── index.ts                      # TypeScript types
├── public/
│   └── img/
│       └── logo.png                  # MHK Travels logo
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts           # Prisma client
│   │   │   ├── jwt.ts                # JWT helpers
│   │   │   └── payhere.ts            # PayHere config
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── package.controller.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── user.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts               # JWT verification
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   └── validation.ts         # Validation middleware
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── package.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── user.routes.ts
│   │   ├── services/
│   │   │   ├── booking.service.ts
│   │   │   └── payment.service.ts
│   │   ├── utils/
│   │   │   ├── validationSchemas.ts
│   │   │   ├── packageValidation.ts
│   │   │   ├── bookingValidation.ts
│   │   │   ├── paymentValidation.ts
│   │   │   └── seedAdmin.ts          # Admin auto-seed
│   │   ├── app.ts                    # Express app
│   │   └── server.ts                 # Server entry
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema
│   │   └── migrations/               # Migration history
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── next.config.mjs
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

<a id="getting-started"></a>
## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 14+ (installed and running)
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/mhk-travels.git
cd mhk-travels
```

#### 2. Install Frontend Dependencies

```bash
npm install --legacy-peer-deps
```

#### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 4. Set Up Environment Variables

Create `backend/.env`:

```env
# Server
PORT=5000

# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mhk_travels?schema=public"

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# PayHere (Sandbox)
PAYHERE_MERCHANT_ID=1238014
PAYHERE_MERCHANT_SECRET=your_merchant_secret_here
PAYHERE_ENVIRONMENT=sandbox
PAYHERE_CURRENCY=LKR
PAYHERE_RETURN_URL=http://localhost:3000/bookings/payment/success
PAYHERE_CANCEL_URL=http://localhost:3000/bookings/payment/failed
PAYHERE_NOTIFY_URL=http://localhost:5000/api/payments/notify
```

Create `.env.local` in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### 5. Set Up the Database

Make sure PostgreSQL is running, then:

```bash
cd backend
npx prisma generate
npx prisma db push
```

#### 6. Run the Development Servers

**Terminal 1 — Backend:**

```bash
cd backend
npm run dev
```

Wait for:

```text
🚀 MHK Travels Backend running on port 5000
📍 Health check: http://localhost:5000/api/health
✅ Admin user already exists.
```

**Terminal 2 — Frontend:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

<a id="environment-variables"></a>
## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/mhk_travels` |
| `JWT_SECRET` | Secret for signing JWT tokens | Long random string |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `PAYHERE_MERCHANT_ID` | PayHere merchant ID | `1238014` |
| `PAYHERE_MERCHANT_SECRET` | PayHere merchant secret | Long Base64 string |
| `PAYHERE_ENVIRONMENT` | `sandbox` or `live` | `sandbox` |
| `PAYHERE_CURRENCY` | Currency code | `LKR` |
| `PAYHERE_RETURN_URL` | Success redirect URL | `http://localhost:3000/...` |
| `PAYHERE_CANCEL_URL` | Failure redirect URL | `http://localhost:3000/...` |
| `PAYHERE_NOTIFY_URL` | Webhook URL | `http://localhost:5000/api/payments/notify` |

### Frontend (`.env.local`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

<a id="database-schema"></a>
## 🗄️ Database Schema

### Models

| Model | Description |
| :--- | :--- |
| `User` | User accounts (users + admins) |
| `Profile` | Extended user details (NIC, passport) |
| `Package` | Hajj/Umrah packages |
| `Hotel` | Hotels for each package (Makkah + Madinah) |
| `Inclusion` | What's included in each package |
| `ItineraryItem` | Day-by-day itinerary |
| `Booking` | Booking records |
| `Traveller` | Individual travellers per booking |
| `Payment` | Payment transactions |
| `Notification` | User notifications |

### Enums

- `Role` — `USER`, `ADMIN`
- `PackageType` — `HAJJ`, `UMRAH`
- `PackageStatus` — `ACTIVE`, `INACTIVE`
- `BookingStatus` — `PENDING_PAYMENT`, `ADVANCE_PAID`, `CONFIRMED`, `DOCUMENTS_PENDING`, `DOCUMENTS_VERIFIED`, `TRAVEL_READY`, `COMPLETED`, `CANCELLED`
- `PaymentStatus` — `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`
- `PaymentType` — `ADVANCE`, `BALANCE`

To view the database visually:

```bash
cd backend
npx prisma studio
```

Opens at [http://localhost:5555](http://localhost:5555)

---

<a id="api-endpoints"></a>
## 🔌 API Endpoints

**Base URL:** `http://localhost:5000/api`

### Health

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| GET | `/health` | Public |

### Authentication

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Private |
| PUT | `/auth/change-password` | Private |

### Packages

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| GET | `/packages` | Public |
| GET | `/packages/:id` | Public |
| POST | `/packages` | Admin |
| PUT | `/packages/:id` | Admin |
| DELETE | `/packages/:id` | Admin |
| PATCH | `/packages/:id/status` | Admin |
| GET | `/packages/admin/stats` | Admin |

### Bookings

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/bookings` | User |
| GET | `/bookings` | User |
| GET | `/bookings/:id` | User |
| PUT | `/bookings/:id/cancel` | User |
| DELETE | `/bookings/:id` | User/Admin |
| GET | `/bookings/admin/all` | Admin |
| GET | `/bookings/admin/stats` | Admin |
| PUT | `/bookings/admin/:id/status` | Admin |

### Payments

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/payments/initiate` | User |
| POST | `/payments/notify` | PayHere Webhook |
| GET | `/payments/verify/:bookingId` | User |
| GET | `/payments` | User |
| GET | `/payments/:id` | User |
| POST | `/payments/manual-confirm` | Admin |
| GET | `/payments/admin/all` | Admin |
| GET | `/payments/admin/stats` | Admin |

### Users

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| GET | `/users` | Admin |
| GET | `/users/:id` | Admin |
| PUT | `/users/:id/role` | Admin |
| GET | `/users/stats` | Admin |

---

<a id="design-system"></a>
## 🎨 Design System

### Colors

| Name | Hex | Usage |
| :--- | :--- | :--- |
| Primary | `#00685f` | User theme, primary CTAs |
| Primary Light | `#008378` | Gradients |
| Tertiary (Gold) | `#8d4b00` | Admin theme, accents |
| Tertiary Container | `#b15f00` | Admin gradients |
| Surface | `#faf8ff` | Page background |
| Error | `#ba1a1a` | Destructive actions |

### Typography

- **Headings** — Outfit (Google Fonts)
- **Body** — Plus Jakarta Sans (Google Fonts)
- **Icons** — Material Symbols Outlined

### Glassmorphism Recipe

```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.9);
border-radius: 1rem;
box-shadow: 0 10px 30px -10px rgba(15, 118, 110, 0.08);
```

### Animations (Framer Motion)

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  whileHover={{ y: -4, scale: 1.02 }}
  transition={{ duration: 0.5 }}
/>
```

---

<a id="testing-credentials"></a>
## 🧪 Testing Credentials

The admin user is auto-seeded on backend startup.

### Admin Account

| Field | Value |
| :--- | :--- |
| Email | `admin@mhktravels.com` |
| Password | `admin123` |
| Access | Full admin panel |

### Test User Accounts

| Email | Password |
| :--- | :--- |
| `rizwan@example.com` | `password123` |
| `fathima@example.com` | `password123` |

### PayHere Sandbox Test Cards

| Card Type | Card Number | Expiry | CVV |
| :--- | :--- | :--- | :--- |
| VISA (Success) | `4916217501611292` | 12/25 | 123 |
| MasterCard | `5307731176664505` | 12/25 | 123 |

---

<a id="deployment"></a>
## 🚀 Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set environment variable:

```text
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
```

4. Deploy

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set environment variables (from `.env`)
5. Point `PAYHERE_NOTIFY_URL` to your Railway URL

### Production Database

Use Neon, Supabase, or Railway PostgreSQL:

```bash
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
```

Run migrations:

```bash
npx prisma migrate deploy
```

---

<a id="contributing"></a>
## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<a id="license"></a>
## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💼 About MHK Travels

**MHK Travels (Pvt) Ltd**
MRCA Registered Hajj Tour Operator No: H-248

📍 #201 1/1, 1st Floor, City Arcade Building, Galle Road, Beruwala, Sri Lanka
📞 Hotline: (+94) 776 290 290
📧 Email: info@mhktravels.com

---

