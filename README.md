# WELLPrint — Premium Printing Services Platform

A production-ready printing services web platform built with **Vite + React**, **Supabase**, and deployed on **Vercel**. Supports a full public storefront, cart system, staff/admin dashboard, order management, product catalog with multi-image galleries, and category management.

---

## Tech Stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Frontend     | Vite 5, React 18, React Router 6                |
| Styling      | Tailwind CSS 3 + Custom Design System           |
| Backend      | Supabase (PostgreSQL + Auth + Storage + Realtime)|
| Deployment   | Vercel                                          |
| Icons        | Lucide React                                    |
| Fonts        | Lora (serif), Montserrat (body)                 |

---

## Features

### Public Storefront
- **Home** — Hero, services marquee, process section, CTA
- **Products** — Live catalog from Supabase with search, category filters, sort, grid/list toggle
- **Product Detail** — Multi-image carousel (thumbnail + gallery), specs, FAQs, options, add to cart
- **Cart** — Persistent cart with quantity controls and bulk discount
- **Services, About, Contact** pages

### Staff / Admin Dashboard (`/dashboard`)
- **Role-based access** — Admin and Staff roles with permission gating
- **Orders** — View, filter, update order status
- **Products** — Full CRUD with thumbnail upload + multi-image gallery upload (Supabase Storage), grid/list view, category dropdown filter
- **Categories** — Full CRUD, real-time sync across all pages, reorder via sort_order
- **Analytics** — Charts and stats
- **Staff Management** — Admin-only staff account management
- **Theme** — Light/dark mode toggle persisted per user

---

## Design System

### Color Palette
```
Backgrounds
  ink-950: #0A0A0A   — deepest background
  ink-900: #111111   — page background
  ink-800: #1A1A1A   — card / panel background

Text
  ivory-50:  #FDFBF4  — near-white
  ivory-200: #F4ECCE  — primary body
  ivory-300: #EBE0B0  — muted text

Brand Accents
  --wp-green:   #13A150  — primary CTA, active states
  --wp-yellow:  #FDC010  — warnings, stars
  --wp-cyan:    #1993D2  — info, categories
  --wp-magenta: #CD1B6E  — alerts, delete actions
```

### Typography
```
Display / Headings:  Lora (serif, 700–900)
Body / UI labels:    Montserrat (font-body class)
```

### Utility Classes
```css
.btn-press        — Green filled button with hover state
.btn-press-ghost  — Ghost/outline button
.card-press       — Dark card with subtle border + hover lift
.animate-on-scroll — Fade-in on scroll via IntersectionObserver
.font-body        — Montserrat sans-serif
```

---

## Project Structure

```
WELLPrint-Website/
├── public/
│   ├── favicon.svg
│   ├── logo.png
│   ├── logos/                    — Brand logo variants (SVG)
│   │   ├── horizontal/
│   │   ├── vertical/
│   │   └── icons/
│   └── images/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── AdminLayout.jsx   — Dashboard shell + sidebar nav
│   │   ├── layout/
│   │   │   ├── Layout.jsx        — Public page shell
│   │   │   └── Navbar.jsx        — Sticky nav + mobile drawer
│   │   ├── sections/             — Homepage sections
│   │   │   ├── HeroSection.jsx
│   │   │   ├── MarqueeStrip.jsx
│   │   │   ├── ServicesSection.jsx
│   │   │   ├── ProcessSection.jsx
│   │   │   ├── SocialProofSection.jsx
│   │   │   └── CTASection.jsx
│   │   └── ui/
│   │       ├── PageHero.jsx      — Reusable page hero banner
│   │       ├── ProductCard.jsx   — Product card component
│   │       └── Skeleton.jsx      — Loading skeleton
│   ├── context/
│   │   ├── AuthContext.jsx       — Auth state + role/permission helpers
│   │   ├── CartContext.jsx       — Cart state (localStorage)
│   │   ├── OrdersContext.jsx     — Orders state + Supabase sync
│   │   └── ThemeContext.jsx      — Light/dark theme toggle
│   ├── hooks/
│   │   └── useProducts.js        — useProducts, useProduct, useCategories (with realtime)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProductsPage.jsx      — Public catalog with filters
│   │   ├── ProductDetailPage.jsx — Detail page with image carousel
│   │   ├── CartPage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── dashboard/
│   │       ├── AdminDashboardPage.jsx    — Admin overview
│   │       ├── StaffDashboardPage.jsx    — Staff overview + quick access
│   │       ├── AdminProductsPage.jsx     — Products CRUD + gallery upload
│   │       ├── AdminCategoriesPage.jsx   — Categories CRUD + realtime sync
│   │       ├── AdminOrdersPage.jsx       — Orders list + filters
│   │       ├── AdminOrderDetailPage.jsx  — Single order management
│   │       ├── AdminAnalyticsPage.jsx    — Charts and stats
│   │       └── AdminStaffPage.jsx        — Staff account management
│   ├── lib/
│   │   └── supabase.js           — Supabase client (env-configured)
│   ├── styles/
│   │   └── globals.css           — Tailwind + design tokens + utilities
│   ├── App.jsx                   — Router + all route definitions
│   └── main.jsx                  — React entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json                   — SPA routing config
├── .env.example
└── supabase_migration_add_images.sql  — Run this in Supabase SQL Editor
```

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Supabase migration
Open **Supabase → SQL Editor** and run:
```sql
-- Adds gallery images array column to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
```
Or run the included `supabase_migration_add_images.sql` file.

### 4. Start the dev server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 5. Build for production
```bash
npm run build
npm run preview   # Preview production build locally
```

---

## Supabase Schema

### `categories`
| Column       | Type    | Notes                          |
|--------------|---------|--------------------------------|
| id           | uuid    | Primary key                    |
| name         | text    | Display name                   |
| slug         | text    | URL-safe identifier (unique)   |
| sort_order   | int     | Controls display order         |

### `products`
| Column           | Type    | Notes                                      |
|------------------|---------|--------------------------------------------|
| id               | uuid    | Primary key                                |
| name             | text    | Product name                               |
| slug             | text    | URL-safe identifier (unique)               |
| short_description| text    | Shown on product cards                     |
| base_price       | numeric | Starting price                             |
| unit             | text    | e.g. pcs, sheets, sq ft                   |
| min_qty          | int     | Minimum order quantity                     |
| turnaround_days  | int     | Production turnaround                      |
| thumbnail_url    | text    | Main image shown on listing page           |
| images           | jsonb   | Array of gallery image URLs (detail page)  |
| status           | text    | `active` or `archived`                     |
| sort_order       | int     | Controls display order                     |
| category_id      | uuid    | FK → categories.id                         |

### `product_variants`
| Column     | Type    | Notes                        |
|------------|---------|------------------------------|
| id         | uuid    | Primary key                  |
| product_id | uuid    | FK → products.id             |
| label      | text    | Variant name                 |
| price      | numeric | Variant price                |

### Supabase Storage
- **Bucket:** `product-images`
  - `products/` — thumbnail images
  - `products/gallery/` — extra carousel images

---

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA client-side routing automatically

---

## Roles & Permissions

| Permission        | Staff | Admin |
|-------------------|-------|-------|
| view_orders       | ✓     | ✓     |
| manage_orders     | ✓     | ✓     |
| view_products     | ✓     | ✓     |
| manage_products   | ✓     | ✓     |
| view_analytics    | ✓     | ✓     |
| staff_management  | ✗     | ✓     |

Permissions are stored on the user profile in Supabase and enforced via `AuthContext.hasPermission()` and route-level `<RequireAdmin>` / `<RequirePermission>` guards in `App.jsx`.

---

## Business Rules

| Rule                                              | Status       |
|---------------------------------------------------|--------------|
| Customers check out as **guest** (no account)     | ✅ Implemented|
| Only Admin/Staff have accounts (Supabase Auth)    | ✅ Implemented|
| Admin creates and manages staff accounts          | ✅ Implemented|
| **10% auto-discount** when cart has 6+ items      | ✅ Implemented|
| Products support multiple gallery images          | ✅ Implemented|
| Category changes reflect in real time sitewide    | ✅ Implemented|
| Product images uploaded to Supabase Storage       | ✅ Implemented|
| File uploads up to 500MB (PDF, AI, PSD)           | 🔲 Phase 3   |

---

## Routes

| Path                          | Component               | Access      |
|-------------------------------|-------------------------|-------------|
| `/`                           | HomePage                | Public      |
| `/products`                   | ProductsPage            | Public      |
| `/products/:slug`             | ProductDetailPage       | Public      |
| `/services`                   | ServicesPage            | Public      |
| `/cart`                       | CartPage                | Public      |
| `/about`                      | AboutPage               | Public      |
| `/contact`                    | ContactPage             | Public      |
| `/login`                      | LoginPage               | Guest only  |
| `/dashboard`                  | Admin/Staff Dashboard   | Auth        |
| `/dashboard/orders`           | AdminOrdersPage         | view_orders |
| `/dashboard/orders/:id`       | AdminOrderDetailPage    | view_orders |
| `/dashboard/products`         | AdminProductsPage       | view_products|
| `/dashboard/categories`       | AdminCategoriesPage     | view_products|
| `/dashboard/analytics`        | AdminAnalyticsPage      | view_analytics|
| `/dashboard/staff`            | AdminStaffPage          | Admin only  |