# WellPrint — Premium Printing Services

A production-ready printing services platform built with **Vite + React**, **Supabase**, and deployed on **Vercel**.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Vite 5, React 18, React Router 6    |
| Styling     | Tailwind CSS 3 + Custom Design System |
| Animation   | Framer Motion + CSS Animations      |
| Backend     | Supabase (PostgreSQL + Auth + Storage) |
| Deployment  | Vercel                              |
| Icons       | Lucide React                        |

---

## Design System

### Color Palette
```
Ink (Primary Background)
  ink-950: #0A0905   — deepest background
  ink-900: #111008   — card backgrounds
  ink-800: #1C1A11   — elevated cards

Ivory (Primary Text)
  ivory-50:  #FDFBF4  — pure white-ivory
  ivory-200: #F4ECCE  — body text
  ivory-300: #EBE0B0  — muted text

Press Accents
  press-gold:  #B8972A — primary accent, CTAs
  press-red:   #C8341A — highlights
  press-amber: #D4810A — secondary accent
```

### Typography
```
Display:  Playfair Display (headings, hero titles)
Heading:  DM Serif Display (section titles)
Body:     DM Sans (body copy, UI)
Mono:     DM Mono (badges, labels, numbers)
```

### Component Classes
```css
.btn-press        — Ivory filled button with press offset shadow
.btn-press-ghost  — Ghost/outline button
.btn-press-gold   — Gold filled button
.badge            — Small label
.badge-gold       — Gold variant badge
.badge-ivory      — Ivory/muted badge
.card-press       — Dark card with hover lift effect
.gold-underline   — Animated gold underline on hover
.grain-overlay    — Ink/noise texture overlay
```

---

## Project Structure

```
wellprint/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx      — App shell wrapper
│   │   │   ├── Navbar.jsx      — Sticky nav + mobile drawer
│   │   │   └── Footer.jsx      — Full footer with newsletter
│   │   ├── sections/
│   │   │   ├── HeroSection.jsx       — Full-viewport hero
│   │   │   ├── MarqueeStrip.jsx      — Scrolling services ticker
│   │   │   ├── ServicesSection.jsx   — 6-card service grid
│   │   │   ├── ProcessSection.jsx    — 4-step how-it-works
│   │   │   ├── SocialProofSection.jsx — Discount banner + testimonials
│   │   │   └── CTASection.jsx        — Bottom call to action
│   │   └── ui/                  — (Phase 2+: reusable UI primitives)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   └── PlaceholderPage.jsx  — Used for upcoming phases
│   ├── lib/
│   │   └── supabase.js          — Supabase client
│   ├── styles/
│   │   └── globals.css          — Tailwind + design tokens + utilities
│   ├── App.jsx                  — Router + all routes
│   └── main.jsx                 — React entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── .env.example
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
# Then edit .env with your Supabase credentials
```

### 3. Run development server
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Build for production
```bash
npm run build
npm run preview  # Preview the production build locally
```

---

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the **Project URL** and **anon/public key** into your `.env`
3. Future phases will add:
   - `products` table (Phase 2)
   - `orders` + `order_items` tables (Phase 3)
   - Auth for admin/staff (Phase 4)
   - Storage bucket for file uploads (Phase 3)

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — `vercel.json` handles SPA routing automatically

---

## Business Rules (Implemented Across Phases)

| Rule                                       | Phase     |
|--------------------------------------------|-----------|
| Customers checkout as **guest** (no account) | Phase 3  |
| Only Admin/Staff have accounts (Supabase Auth) | Phase 4 |
| Admin creates staff accounts               | Phase 4   |
| **10% auto-discount** when cart has 6+ items | Phase 3  |
| File uploads up to **500MB** (PDF, AI, PSD) | Phase 3  |

---

## Phase Roadmap

- [x] **Phase 1** — Project setup, design system, landing page
- [ ] **Phase 2** — Product catalog + product detail pages
- [ ] **Phase 3** — Cart + guest checkout + file upload
- [ ] **Phase 4** — Admin/Staff auth + dashboard + order management
- [ ] **Phase 5** — About, Contact, FAQ, Blog pages
