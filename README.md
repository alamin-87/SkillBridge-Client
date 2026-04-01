<p align="center">
  <h1 align="center">🎓 SkillBridge — Client</h1>
  <p align="center">
    A modern tutoring marketplace frontend built with <strong>Next.js 16</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS 4</strong>.
    <br />
    Connect students with expert tutors · Book sessions · Process payments · Manage assignments
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Stripe-BDT-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000?logo=vercel" alt="Vercel" />
</p>

---

## 📋 Table of Contents

- [Project Summary](#-project-summary)
- [Recent Updates](#-recent-updates)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Local Setup](#-local-setup)
- [Running & Development](#-running--development)
- [Production Build & Deployment](#-production-build--deployment)
- [Architecture & Folder Layout](#-architecture--folder-layout)
- [Full Project Folder Structure](#-full-project-folder-structure)
- [Detailed Folder Descriptions](#-detailed-folder-descriptions)
- [Authentication & Proxy Behavior](#-authentication--proxy-behavior)
- [Role-Based Dashboards](#-role-based-dashboards)
- [Payment & Checkout (Stripe)](#-payment--checkout-stripe)
- [Session Booking Workflow](#-session-booking-workflow)
- [Assignment System](#-assignment-system)
- [Notification System](#-notification-system)
- [Tutor Availability Management](#-tutor-availability-management)
- [Become a Tutor Request Workflow](#-become-a-tutor-request-workflow)
- [Admin Panel](#-admin-panel)
- [Email Templates](#-email-templates)
- [Scheduled Tasks (Cron)](#-scheduled-tasks-cron)
- [Public Pages](#-public-pages)
- [Developer Accounts & Onboarding](#-developer-accounts--onboarding)
- [Common Issues & Troubleshooting](#-common-issues--troubleshooting)
- [Testing, Linting & Formatting](#-testing-linting--formatting)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## 🎯 Project Summary

This repository contains the frontend client for **SkillBridge** — a full-featured tutoring marketplace that connects students, tutors, and admins. The UI is built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, and integrates with a separate backend API for authentication, data, payment processing, and email notifications.

SkillBridge supports the complete lifecycle of online tutoring: student registration, tutor discovery, session booking, **Stripe-powered payments in BDT (Bangladeshi Taka)**, assignment management with **Cloudinary PDF uploads**, real-time notifications, automated session reminders, analytics dashboards, and a comprehensive admin moderation panel.

---

## 🆕 Recent Updates

| Feature | Description |
|---------|-------------|
| **Global Authentication Synchronization** | Real-time cross-tab authentication state updates using Better Auth hooks; UI updates instantly without requiring page refreshes after logins/logouts. |
| **Universal Cloudinary PDF Uploads** | Secure uploading and fetching of PDF assignment resources dynamically configured via `auto` resource types for broader accessibility. |
| **Tutor Assignment Deletion** | Tutors can securely remove and clean up old assignments they have deployed to students. |
| **Automated Email Notifications** | Deeply integrated transactional assignment creation and grading notification emails sent directly to students. |
| **Dynamic Package Pricing** | Real-time total cost calculation on the booking UI mapping single vs 30-day package rate multipliers directly into Stripe Intent BDT currency. |
| **Redesigned Become a Tutor UX** | Complete UI overhaul of the tutor application page with theme-aware design (light/dark mode), clear professional form labels, split-panel layout with step indicators, category picker cards, and missing fields (location, languages) added for a polished, accessible experience. |

---

## ✨ Features

### Core Platform

- Role-based layouts and route protection (student, tutor, admin) using Next.js parallel routes (`@student`, `@tutor`, `@admin`)
- Authentication flows (email/password, social sign-in, forgot/reset password, email verification) proxied to the backend
- Dark / Light mode toggle with `next-themes`
- Responsive, glassmorphic dashboard UI with collapsible sidebar navigation
- Reusable UI components built on Radix UI primitives (dialog, dropdown, accordion, tooltip, etc.)

### 🧑‍🎓 Student Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Analytics overview with Recharts charts (bookings, payments, activity) |
| **Session Booking** | Browse tutor profiles, select availability slots (single session or 30-day package), dynamic pricing |
| **Stripe Checkout** | SSL-encrypted payment form with real-time booking summary |
| **My Bookings** | View, manage, and cancel bookings; access auto-generated meeting links |
| **Assignments** | View assigned work, submit solutions (PDF upload via Cloudinary), track grades |
| **Payments** | Payment history with instructor & session details, deep-linked tutor profiles |
| **Reviews** | Leave and manage reviews for tutors |
| **Become a Tutor** | Apply to become a tutor with bio, hourly rate, experience, institution, location, and languages; theme-aware split-panel form with step indicators, category picker cards, and application status tracker with edit/withdraw actions |
| **Profile** | Update personal info and avatar |

### 👨‍🏫 Tutor Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Earnings overview, session metrics, analytics charts |
| **Sessions** | Manage confirmed/pending/completed sessions with meeting links |
| **Assignments** | Create assignments for students, evaluate submissions, provide grades and feedback reports |
| **Earnings** | Detailed earnings breakdown and history |
| **Availability** | Create, update, and delete time slots (single session or 30-day recurring packages) |
| **Profile** | Update tutor-specific information |

### 🛡️ Admin Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Platform-wide analytics (total users, revenue, bookings, active tutors, etc.) |
| **User Management** | Search, filter by role/status, update status (ACTIVE/BANNED), change roles, delete users |
| **Booking Management** | View all bookings, update status (PENDING/CONFIRMED/COMPLETED/CANCELLED), delete |
| **Payment Management** | View all platform payments and transaction details |
| **Category Management** | CRUD operations for tutoring categories |
| **Tutor Request Moderation** | Approve or reject "Become a Tutor" applications with rejection reasons |
| **Review Moderation** | View and delete inappropriate reviews |
| **Assignment Management** | View and delete assignments platform-wide |
| **Notification Management** | View all notifications, broadcast to all users, send targeted notifications, delete |
| **Profile** | Admin profile settings |

### 💳 Payment System

- **Stripe integration** with `@stripe/react-stripe-js` and `@stripe/stripe-js`
- **BDT currency** (Bangladeshi Taka) for regional compatibility
- Payment intent creation, webhook handling, and manual sync fallback
- Automatic post-payment processing: booking confirmation, meeting link generation, tutor earnings increment, dual email notifications (invoice + session link)
- Payment status tracking: `INITIATED` → `SUCCESS` / `FAILED`

### 🔔 Notification System

- Real-time notification bell in dashboard header
- Mark individual or all notifications as read
- System-generated notifications for: payments, bookings, session reminders, tutor request approvals/rejections
- Admin broadcast and targeted notification delivery

### 📧 Email Notifications

| Template | Trigger |
|----------|---------|
| Payment invoice | After successful payment (student + tutor) |
| Session meeting link | After booking confirmation (student + tutor) |
| Tutor application approval/rejection | After admin action |
| OTP verification | During email verification |
| Session reminder | 5 minutes before start (via cron scheduler) |
| Assignment notification | On assignment creation and grading |

### ⏰ Scheduled Tasks

- Automated cron job (runs every minute) checks for sessions starting in ~5 minutes
- Sends system notifications and emails to both student and tutor with meeting link

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Library | React 19 |
| Styling | Tailwind CSS 4 |
| Component Primitives | Radix UI (dialog, dropdown, avatar, accordion, tooltip, separator, etc.) |
| Forms | @tanstack/react-form + Zod validation |
| Charts | Recharts |
| Payments | Stripe (@stripe/react-stripe-js, @stripe/stripe-js) |
| Authentication | better-auth (client helper) |
| Theming | next-themes |
| Animations | Lottie React, tw-animate-css |
| Toasts | Sonner |
| Env Validation | @t3-oss/env-nextjs + Zod |
| Icons | Lucide React (with custom icon mapper) |

---

## 📦 Prerequisites

- **Node.js** 18+ and npm (or pnpm/yarn)
- A running **backend API** (e.g., `http://localhost:5000`)
- A **Stripe account** with publishable key (for payment features)

> **Note:** The frontend expects a separate backend for auth, API, and payment webhooks; it does not include the backend code.

---

## 🔐 Environment Variables

This project validates required env variables using `src/env.ts` with `@t3-oss/env-nextjs`. Create a `.env.local` at the project root (**do NOT commit it**).

### Minimum `.env.local`

```env
# Server-side service URLs (required by env validation)
AUTH_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000

# Client-side (browser-accessible)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

### Variable Reference

| Variable | Side | Description |
|----------|------|-------------|
| `AUTH_URL` | Server | Backend base URL for server-side auth calls |
| `BACKEND_URL` | Server | Backend base URL for general server-side requests |
| `API_URL` | Server | Backend API URL for service layer calls |
| `FRONTEND_URL` | Server | Frontend URL (used for redirects and CORS) |
| `NEXT_PUBLIC_BACKEND_URL` | Client | Backend URL used by `next.config.ts` rewrites (browser-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe publishable key for payment element initialization |

> **⚠️ Important:**
> - `NEXT_PUBLIC_BACKEND_URL` must point to your backend host (**NOT** `http://localhost:3000`). If set to `http://localhost:3000` the Next dev server will proxy requests to itself, causing `EADDRINUSE`, `ECONNRESET`, and `socket hang up` errors.
> - `AUTH_URL` is used by server-side services (e.g., `src/services/user.services.ts`).
> - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is required for the Stripe checkout to render the payment element.

---

## 🚀 Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd skillbridge-client

# 2. Install dependencies
npm install

# 3. Create .env.local using the example above

# 4. Start the backend API (see backend README)
# In your backend repo:
npm run dev
# Backend listens on http://localhost:5000

# 5. Start the frontend
npm run dev

# 6. Open http://localhost:3000 in your browser
```

---

## 🔧 Running & Development

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |

> When developing, make sure your backend is running and `NEXT_PUBLIC_BACKEND_URL` points at it.

---

## 🚢 Production Build & Deployment

```bash
# Build
npm run build

# Start
npm start
```

### Vercel Deployment Notes

- Add environment variables in the Vercel dashboard (`NEXT_PUBLIC_BACKEND_URL`, `AUTH_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, etc.)
- Ensure the backend URL used by `NEXT_PUBLIC_BACKEND_URL` is reachable from Vercel
- Configure Stripe webhook endpoint in your Stripe dashboard pointing to your backend's webhook route

---

## 🏗 Architecture & Folder Layout

```
app/                → Next.js app routes & layouts (App Router) with parallel route slots
src/components/     → Shared UI components and layouts
src/components/modules/ → Feature UI components grouped per domain
src/components/shared/  → Cross-cutting components (e.g., NotificationBell)
src/services/       → Server-side API wrappers (11 service files)
src/actions/        → Next.js Server Actions (10 action files)
src/routes/         → Role-based sidebar navigation configs
src/lib/            → Helpers (auth-client, stripe, icon-mapper, utils)
proxy.ts            → Middleware that redirects and enforces route access by role
next.config.ts      → Rewrites that forward /api/auth/* and /api/* to the backend
```

---

## 📂 Full Project Folder Structure

<details>
<summary>Click to expand full tree</summary>

```
skillbridge-client/
├── public/
│   ├── home/
│   │   └── hero.jpg
│   ├── lottie/
│   │   ├── Login Leady.json
│   │   └── loginLottie.json
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── actions/
│   │   ├── admin-action.ts
│   │   ├── assignment-action.ts
│   │   ├── availability-action.ts
│   │   ├── booking-action.ts
│   │   ├── category-action.ts
│   │   ├── notification-action.ts
│   │   ├── payment-action.ts
│   │   ├── student-action.ts
│   │   ├── tutor-action.ts
│   │   └── user-action.ts
│   ├── app/
│   │   ├── (CommonLayout)/
│   │   │   ├── (authRouteGroup)/
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── login/
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reset-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── verify-email/
│   │   │   │       ├── loading.tsx
│   │   │   │       └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── help/
│   │   │   │   └── page.tsx
│   │   │   ├── how-it-works/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   ├── tutors/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── users/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── (DashboardLayout)/
│   │   │   ├── @admin/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── assignments/
│   │   │   │   │   │   ├── assignment-delete-button.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── bookings/
│   │   │   │   │   │   ├── booking-delete-button.tsx
│   │   │   │   │   │   ├── booking-status-actions.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   ├── category-create.tsx
│   │   │   │   │   │   ├── category-row.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── notifications/
│   │   │   │   │   │   ├── notification-delete-button.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── send-notification-form.tsx
│   │   │   │   │   ├── payments/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── payment-charts.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── profile-form.tsx
│   │   │   │   │   ├── reviews/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── review-charts.tsx
│   │   │   │   │   │   └── review-delete-button.tsx
│   │   │   │   │   ├── tutor-requests/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── tutor-request-actions.tsx
│   │   │   │   │   ├── users/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   ├── user-filters.tsx
│   │   │   │   │   │   └── user-row-actions.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── default.tsx
│   │   │   ├── @student/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── assignments/
│   │   │   │   │   │   ├── AssignmentSubmitDialog.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── become-tutor/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── tutor-request-form.tsx
│   │   │   │   │   ├── bookings/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── checkout/
│   │   │   │   │   │   └── [bookingId]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── payments/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── profile/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── profile-form.tsx
│   │   │   │   │   ├── reviews/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── dashboard-charts.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   └── default.tsx
│   │   │   ├── @tutor/
│   │   │   │   ├── tutor/
│   │   │   │   │   ├── availability/
│   │   │   │   │   │   ├── availability-client.tsx
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── create/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── TutorCreateProfileForm.tsx
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   ├── assignments/
│   │   │   │   │   │   │   ├── assignments-charts.tsx
│   │   │   │   │   │   │   ├── create-assignment-dialog.tsx
│   │   │   │   │   │   │   ├── evaluate-dialog.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── earnings/
│   │   │   │   │   │   │   ├── earnings-charts.tsx
│   │   │   │   │   │   │   └── page.tsx
│   │   │   │   │   │   ├── sessions/
│   │   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   │   └── session-actions.tsx
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── tutor-dashboard-charts.tsx
│   │   │   │   │   └── profile/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── tutor-profile-form.tsx
│   │   │   │   └── default.tsx
│   │   │   ├── default.tsx
│   │   │   ├── layout.tsx
│   │   │   └── loading.tsx
│   │   ├── error.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── DashboardHeaderProfile.tsx
│   │   │   ├── dropdown-menu-standard-6.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── logo.tsx
│   │   │   ├── ModeToggle.tsx
│   │   │   └── Navbar.tsx
│   │   ├── modules/
│   │   │   ├── authentication/
│   │   │   │   ├── forgot-password-form.tsx
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── reset-password-form.tsx
│   │   │   │   ├── signup-form.tsx
│   │   │   │   └── verify-email-form.tsx
│   │   │   ├── categories/
│   │   │   │   └── CategoriesView.tsx
│   │   │   ├── home/
│   │   │   │   ├── CtaSection.tsx
│   │   │   │   ├── DiscoverTutorsSection.tsx
│   │   │   │   ├── FeaturedCategoriesSection.tsx
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HowItWorksSection.tsx
│   │   │   │   └── TestimonialsSection.tsx
│   │   │   ├── payments/
│   │   │   │   └── checkout-form.tsx
│   │   │   ├── student/
│   │   │   │   └── student-profileView.tsx
│   │   │   └── tutors/
│   │   │       ├── book-session-modal.tsx
│   │   │       ├── TutorProfileView.tsx
│   │   │       └── Tutors.tsx
│   │   ├── shared/
│   │   │   └── NotificationBell.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── collapsible.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── radio-group.tsx
│   │       ├── search-form.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── table.tsx
│   │       ├── textarea.tsx
│   │       ├── tooltip.tsx
│   │       └── version-switcher.tsx
│   ├── constance/
│   │   └── role.ts
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── auth-client.ts
│   │   ├── icon-mapper.ts
│   │   ├── stripe.ts
│   │   └── utils.ts
│   ├── providers/
│   │   └── ThemeProvider.tsx
│   ├── routes/
│   │   ├── adminRoute.ts
│   │   ├── studentRoute.ts
│   │   └── tutorRoute.ts
│   ├── services/
│   │   ├── admin.services.ts
│   │   ├── assignment.services.ts
│   │   ├── availability.services.ts
│   │   ├── booking.services.ts
│   │   ├── category.services.ts
│   │   ├── notification.services.ts
│   │   ├── payment.services.ts
│   │   ├── student.services.ts
│   │   ├── tutor.services.ts
│   │   ├── user.services.middleware.ts
│   │   └── user.services.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── routeType.ts
│   │   ├── tutorType.ts
│   │   └── userType.ts
│   ├── zod/
│   │   └── auth.validation.ts
│   └── env.ts
├── .gitignore
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── proxy.ts
├── README.md
└── tsconfig.json
```

</details>

---

## 📖 Detailed Folder Descriptions

### `src/actions/` — Next.js Server Actions (10 files)

| File | Responsibility |
|------|---------------|
| `admin-action.ts` | Admin operations (users, bookings, categories, reviews, assignments, notifications, tutor requests) |
| `tutor-action.ts` | Tutor session and profile management |
| `student-action.ts` | Student profile and tutor request |
| `booking-action.ts` | Create booking |
| `payment-action.ts` | Create payment intent, sync payment |
| `assignment-action.ts` | Submit assignment |
| `availability-action.ts` | CRUD availability slots |
| `notification-action.ts` | Mark read, mark all read |
| `category-action.ts` | Category operations |
| `user-action.ts` | User operations |

### `src/app/(CommonLayout)/` — Public Pages (no auth required)

- `page.tsx` — Homepage (hero, featured categories, discover tutors, how it works, testimonials, CTA)
- `(authRouteGroup)/` — login, register, forgot-password, reset-password, verify-email
- `tutors/` — Tutor listing + `[id]` dynamic profile page with booking modal
- `categories/`, `about/`, `contact/`, `help/`, `how-it-works/`, `privacy/`, `terms/` — informational/legal pages
- `users/[id]/` — Public user profiles

### `src/app/(DashboardLayout)/` — Protected Dashboard

- `layout.tsx` — Dashboard shell (sidebar, header, breadcrumb, notification bell, mode toggle, profile dropdown)
- `@student/dashboard/` — Student pages (analytics, bookings, checkout, assignments, payments, reviews, become-tutor, profile)
- `@tutor/tutor/` — Tutor pages (dashboard, sessions, assignments, earnings, availability, profile, create profile)
- `@admin/admin/` — Admin pages (dashboard, users, bookings, payments, categories, tutor-requests, reviews, assignments, notifications, profile)

### `src/components/layouts/` — App Shell Components

| File | Purpose |
|------|---------|
| `app-sidebar.tsx` | Collapsible sidebar with role-based navigation |
| `Navbar.tsx` | Public-facing navigation bar |
| `footer.tsx` | Site footer |
| `ModeToggle.tsx` | Dark/light theme switcher |
| `DashboardHeaderProfile.tsx` | Header profile dropdown |
| `logo.tsx` | SkillBridge logo component |

### `src/components/modules/` — Feature UI Components

- `authentication/` — login-form, signup-form, forgot-password-form, reset-password-form, verify-email-form
- `home/` — HeroSection, CtaSection, DiscoverTutorsSection, FeaturedCategoriesSection, HowItWorksSection, TestimonialsSection
- `tutors/` — Tutors listing, TutorProfileView, BookSessionModal
- `payments/` — CheckoutForm (Stripe Elements wrapper)
- `student/` — StudentProfileView
- `categories/` — CategoriesView

### `src/components/ui/` — Design System Primitives (27 components)

- **Radix-based:** accordion, alert-dialog, avatar, badge, breadcrumb, button, card, collapsible, context-menu, dialog, dropdown-menu, navigation-menu, radio-group, select, separator, sheet, sidebar, skeleton, table, tooltip
- **Custom:** field, input, label, search-form, sonner (toast), textarea, version-switcher

### `src/components/shared/` — Cross-Cutting Components

- `NotificationBell.tsx` — Real-time notification dropdown with unread count

### `src/services/` — Server-Side API Wrappers (11 files)

| File | Responsibility |
|------|---------------|
| `admin.services.ts` | Comprehensive admin API (users, bookings, payments, categories, reviews, assignments, notifications, tutor requests) |
| `tutor.services.ts` | Tutor profile, availability, sessions |
| `student.services.ts` | Student bookings, reviews, tutor application, profile |
| `payment.services.ts` | Payment intent, sync, history |
| `booking.services.ts` | Booking creation |
| `assignment.services.ts` | Assignment listing, details, submission |
| `availability.services.ts` | CRUD for tutor availability slots |
| `notification.services.ts` | Get, mark read, mark all read |
| `category.services.ts` | Category listing |
| `user.services.ts` | Session utilities and server-side auth calls |
| `user.services.middleware.ts` | Auth middleware helpers |

### `src/routes/` — Sidebar Navigation Configs

| File | Navigation Items |
|------|-----------------|
| `adminRoute.ts` | Dashboard, Users, Bookings, Payments, Categories, Tutor Requests, Reviews, Notifications, Assignments, Profile |
| `studentRoute.ts` | Dashboard, My Bookings, Assignments, Payments, My Reviews, Become a Tutor, Profile |
| `tutorRoute.ts` | Dashboard, Sessions, Assignments, Earnings, Availability, Profile |

### Other Directories

| Path | Purpose |
|------|---------|
| `src/lib/` | `auth-client.ts` (auth wrapper), `stripe.ts` (Stripe init), `icon-mapper.ts` (Lucide icon resolver), `utils.ts` (helpers) |
| `src/types/` | TypeScript type definitions (`index.ts`, `routeType.ts`, `tutorType.ts`, `userType.ts`) |
| `src/zod/` | Validation schemas (`auth.validation.ts` — Zod schemas for auth forms) |
| `src/constance/` | Constants (`role.ts` — role enums: STUDENT, TUTOR, ADMIN) |
| `src/hooks/` | Custom React hooks (`use-mobile.ts` / `use-mobile.tsx` — responsive breakpoint detection) |
| `src/providers/` | React context providers (`ThemeProvider.tsx` — next-themes dark/light mode) |
| `src/env.ts` | Runtime env validation using `@t3-oss/env-nextjs` |
| `proxy.ts` | Middleware for role-based route protection |
| `next.config.ts` | Next.js config with API rewrites and image optimization |

---

## 🔑 Authentication & Proxy Behavior

- Browser requests to `/api/auth/:path*` are rewritten (in `next.config.ts`) to `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`
- All `/api/:path*` requests are also proxied to the backend
- Server-side code (inside Next Server runtime) calls the backend directly using `AUTH_URL` / `API_URL`
- `proxy.ts` checks session and user role and redirects users accordingly
- Authentication supports: email/password login, social sign-in, forgot password, reset password, and email verification flows

---

## 🎭 Role-Based Dashboards

The dashboard uses Next.js **parallel routes** (`@student`, `@tutor`, `@admin`) to render different content based on the authenticated user's role. The layout component (`(DashboardLayout)/layout.tsx`) fetches the current user session and conditionally renders the appropriate parallel route slot.

**Dashboard Shell Features:**

- Collapsible sidebar with role-specific navigation
- Sticky header with quick search, dark/light mode toggle, notification bell, and profile dropdown
- Context bar with breadcrumb navigation, role badge, and Help Center / Explore Tutors quick links
- Glassmorphic card design with decorative background blobs
- Responsive layout with `max-w-screen-2xl` content area

---

## 💳 Payment & Checkout (Stripe)

### Flow

```
1. Student selects tutor availability slot → BookSessionModal
2. Booking record created via createBookingAction
3. Redirect to /dashboard/checkout/[bookingId]
4. Stripe Payment Intent created via createPaymentIntent
5. CheckoutForm renders Stripe Elements with client secret
6. On successful payment:
   ├── Backend marks booking as CONFIRMED, payment as PAID
   ├── Auto-generates meeting link (Google Meet format)
   ├── Increments tutor's totalEarnings
   ├── Creates system notifications for both parties
   ├── Sends invoice email to student + confirmation to tutor
   └── Sends dedicated meeting link emails to both
7. Webhook handler provides redundant payment confirmation path
8. Manual syncPayment fallback available when webhooks are delayed
```

### Pricing

| Type | Calculation |
|------|------------|
| **Single Session** | `hourlyRate × durationHours × 1` |
| **30-Day Package** | `hourlyRate × durationHours × 30` |

> Currency: **BDT** (Bangladeshi Taka), displayed as `৳`

---

## 📅 Session Booking Workflow

1. Student browses the tutor listing page (`/tutors`) with search and filter capabilities
2. Student opens a tutor profile page (`/tutors/[id]`) to view bio, expertise, rating, hourly rate, and available slots
3. Student clicks "Book a Session" to open the booking modal
4. Modal displays available slots with type badges (`1 Session` / `30 Days`) and dynamic total price
5. On confirm, a booking is created and student is redirected to checkout
6. After payment, both parties receive meeting links via notifications and email

---

## 📝 Assignment System

### Tutor Side

- **Create assignments** — title, description, due date, resource file upload (PDF via Cloudinary)
- **View submissions** — see student submissions with timestamps
- **Evaluate** — grade assignments, provide feedback, upload evaluation reports (PDF)
- **Analytics charts** — submission and grading statistics

### Student Side

- **View assignments** — list of assignments with status (pending/submitted/graded), due dates, and resource links
- **Submit solutions** — upload PDF submissions via Cloudinary
- **Track grades** — view grades and tutor feedback

---

## 🔔 Notification System

- **NotificationBell** component in dashboard header with unread count badge
- Dropdown shows recent notifications with timestamps
- Actions: mark individual as read, mark all as read
- Notification types: `PAYMENT`, `BOOKING`, `ASSIGNMENT`, `GENERAL`
- Admin can broadcast notifications to all users or send to specific users

---

## 📆 Tutor Availability Management

Tutors manage their availability through dedicated services:

- **Create slots** — define start/end time windows with type (`SINGLE` or `PACKAGE_30D`)
- **Update slots** — modify existing availability
- **Delete slots** — remove availability
- Slots are displayed on the tutor's public profile for students to book

---

## 🎓 "Become a Tutor" Request Workflow

1. Student fills out the application form: bio, hourly rate, experience years, institution, location, languages
2. Application is submitted via `requestToBecomeTutor`
3. Student can track their request status via `getMyTutorRequest`
4. Admin reviews pending requests in the **Tutor Requests** panel
5. Admin can **approve** (promotes user to TUTOR role, sends approval email) or **reject** (with reason, sends rejection email)

---

## 🛡️ Admin Panel

| Section | Features |
|---------|----------|
| **Dashboard** | Platform-wide analytics — total users, revenue, bookings, active tutors, growth metrics |
| **Users** | Search/filter, view profiles, update status (ACTIVE/BANNED), change roles, delete users |
| **Bookings** | View all bookings, update status, delete bookings |
| **Payments** | View all transactions across the platform |
| **Categories** | Create, update, delete tutoring categories |
| **Tutor Requests** | Approve/reject with rejection reasons, view pending + all requests |
| **Reviews** | View and moderate (delete) reviews |
| **Assignments** | View and moderate (delete) assignments |
| **Notifications** | View all, broadcast to all users, send to specific user, delete |
| **Profile** | Admin profile management |

---

## 📧 Email Templates

The backend uses EJS templates for transactional emails:

| Template | Purpose |
|----------|---------|
| `invoice.ejs` | Payment invoice with booking details and amount |
| `sessionLink.ejs` | Dedicated meeting link delivery to student and tutor |
| `otp.ejs` | OTP verification code for email verification |
| `tutorApprovalEmail.ejs` | Tutor application approved notification |
| `tutorRejectionEmail.ejs` | Tutor application rejected (with reason) notification |
| `assignment.ejs` | Assignment-related notifications |
| `googleRedirect.ejs` | OAuth redirect handler |

---

## ⏰ Scheduled Tasks (Cron)

The backend runs a cron scheduler (`node-cron`) with the following automated task:

- **Session Reminder** — runs every minute, finds CONFIRMED bookings starting in ~5 minutes, sends system notifications and emails to both student and tutor with the meeting link.

---

## 🌐 Public Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured categories, discover tutors, how it works, testimonials, CTA |
| `/tutors` | Tutor listing with search and filters |
| `/tutors/[id]` | Individual tutor profile with booking modal |
| `/categories` | Browse all tutoring categories |
| `/about` | About SkillBridge |
| `/contact` | Contact form/information |
| `/help` | Help center / FAQ |
| `/how-it-works` | Platform walkthrough |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Password recovery |
| `/reset-password` | Password reset |
| `/verify-email` | Email verification |

---

## 👥 Developer Accounts & Onboarding

### 1. Source & CI

- GitHub: ensure all developers have access to the project repository. Create teams: `frontend`, `backend`, `devops`.
- Branching: main protected, PRs required with code review and passing CI checks.
- CI: connect GitHub Actions or Vercel to run linting and build on PRs.

### 2. Hosting & Environment

- **Vercel** (recommended): create a Vercel project linked to the GitHub repo.
- Add environment variables in Vercel for each environment (Preview, Production):
  - `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `AUTH_URL`, `BACKEND_URL`, `API_URL`, `FRONTEND_URL`
- Create separate environments for `staging` and `production` with appropriate backend URLs.

### 3. Backend & Database Access

- Backend dev server: give developers instructions to run locally (repo, start command, DB connection string).
- Database: provide a shared dev database (Postgres/Prisma) or local dev container instructions (`docker-compose`), and create sample seed data for test accounts.

### 4. OAuth & Third-Party Services

- **OAuth providers** (Google, Facebook): create credentials in the provider console and store client IDs/secrets in environment variables for each environment.
- **Stripe**: create test-mode API keys and configure webhooks for the development backend endpoint.
- **Email provider**: configure SMTP or transactional email provider (SendGrid, Mailgun, Nodemailer) and store credentials in env.
- **Cloudinary**: configure upload preset for PDF file hosting (assignments, evaluation reports).
- **Sentry/Monitoring**: add DSN in env for error reporting (optional).

### 5. Developer Onboarding Checklist

- [ ] Obtain GitHub access and clone the repo
- [ ] Add SSH keys (if required) or use HTTPS auth
- [ ] Create `.env.local` using the example; request dev backend URL if you don't run backend locally
- [ ] Obtain Stripe test publishable key and add to `.env.local`
- [ ] Run backend locally or point `NEXT_PUBLIC_BACKEND_URL` to shared dev API
- [ ] Run `npm install` and `npm run dev` and confirm the app renders
- [ ] Use seeded accounts (admin, tutor, student) to test role pages
- [ ] Test the full booking → payment → meeting link flow in Stripe test mode

### 6. Test Accounts (Suggested)

| Email | Role |
|-------|------|
| `admin@example.com` | Admin |
| `tutor@example.com` | Tutor |
| `student@example.com` | Student |

### 7. Security / Access Control

- Never commit `.env.local` or secrets. Use secret management in CI and hosting.
- Use least privilege for service accounts and rotate keys periodically.
- All payments are processed via Stripe (PCI-compliant) — no card data touches your servers.

---

## 🐛 Common Issues & Troubleshooting

| # | Issue | Solution |
|---|-------|----------|
| 1 | **ECONNRESET / socket hang up / EADDRINUSE** | `NEXT_PUBLIC_BACKEND_URL` points to your Next dev server (self-proxy). Set it to your backend URL instead. |
| 2 | **Environment validation failing on dev or build** | The project uses `@t3-oss/env-nextjs` to validate env at runtime. Make sure all required env vars from `src/env.ts` exist in `.env.local`, including `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_BACKEND_URL`. |
| 3 | **Cookies / session not propagated** | Server-side requests to the backend include cookies via `cookies()` (Next server headers). Ensure backend permits and recognizes cookie-based auth for the host domain. |
| 4 | **Static assets not loading** | Check `next.config.ts` `images.remotePatterns` (currently set to wildcard `**`) and `public/` folder. |
| 5 | **Stripe payment element not rendering** | Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set and valid. Check browser console for Stripe initialization errors. |
| 6 | **PDF assignments returning 401 Unauthorized** | Ensure Cloudinary uploads use `auto` resource type (not `raw`) for public CDN accessibility. |
| 7 | **Payment shows "Payment Unavailable"** | Check that the backend API is reachable from the frontend's server-side (not blocked by Vercel deployment protection). Verify the Stripe secret key is configured on the backend. |
| 8 | **Meeting link not generated after payment** | Meeting links are generated in the `processSuccessfulPayment` backend function. Ensure the Stripe webhook is configured or that the `syncPayment` fallback executes correctly. |

---

## 🧪 Testing, Linting & Formatting

| Command | Description |
|---------|-------------|
| `npm run lint` | Run ESLint 9 checks |
| — | Formatting: follow existing project conventions. Add Prettier if needed. |

---

## 🤝 Contributing

1. Fork the repo and open a PR
2. Keep changes focused and small — one feature/bug per PR
3. Run the app locally and verify flows (login, role-based pages, booking → payment → meeting link, assignment submission, etc.) before requesting review

---

## 📞 Contact

For questions or help, open an issue on the repository or contact the maintainers listed in the project.

---

## 📄 License

ISC

---

<p align="center">
  <strong>Last Updated:</strong> April 1, 2026<br />
  <strong>Maintainer:</strong> alamin-87<br />
  <strong>Repository:</strong> <a href="https://github.com/alamin-87/SkillBridge-client">github.com/alamin-87/SkillBridge-client</a>
</p>
