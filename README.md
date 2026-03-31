# SkillBridge

Comprehensive documentation for the SkillBridge frontend client (Next.js App Router + TypeScript).

## Table of Contents

- Project Summary
- Features
- Tech Stack
- Prerequisites
- Environment Variables
- Local Setup (A→Z)
- Running & Development
- Production Build & Deployment
- Architecture & Folder Layout
- Detailed Folder Structure
- Authentication & Proxy Behavior
- Role-Based Dashboards
- Payment & Checkout (Stripe)
- Session Booking Workflow
- Assignment System
- Notification System
- Tutor Availability Management
- "Become a Tutor" Request Workflow
- Admin Panel
- Email Templates
- Scheduled Tasks (Cron)
- Public Pages
- Developer Accounts & Onboarding (Professional)
- Common Issues & Troubleshooting
- Testing, Linting & Formatting
- Contributing
- Contact
- License

---

## Project Summary

This repository contains the frontend client for **SkillBridge** — a full-featured tutoring marketplace that connects students, tutors, and admins. The UI is built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, and integrates with a separate backend API for authentication, data, payment processing, and email notifications.

SkillBridge supports the complete lifecycle of online tutoring: student registration, tutor discovery, session booking, **Stripe-powered payments in BDT (Bangladeshi Taka)**, assignment management with **Cloudinary PDF uploads**, real-time notifications, automated session reminders, analytics dashboards, and a comprehensive admin moderation panel.

## Features

### Core Platform
- Role-based layouts and route protection (student, tutor, admin) using Next.js parallel routes (`@student`, `@tutor`, `@admin`)
- Authentication flows (email/password, social sign-in, forgot/reset password, email verification) proxied to the backend
- Dark / Light mode toggle with `next-themes`
- Responsive, glassmorphic dashboard UI with collapsible sidebar navigation
- Reusable UI components built on Radix UI primitives (dialog, dropdown, accordion, tooltip, etc.)

### Student Features
- **Dashboard** — analytics overview with Recharts charts (bookings, payments, activity)
- **Session booking** — browse tutor profiles, select availability slots (single session or 30-day package), dynamic pricing
- **Stripe checkout** — SSL-encrypted payment form with real-time booking summary
- **My Bookings** — view, manage, and cancel bookings; access auto-generated meeting links
- **Assignments** — view assigned work, submit solutions (PDF upload via Cloudinary), track grades
- **Payments** — payment history with instructor & session details, deep-linked tutor profiles
- **Reviews** — leave and manage reviews for tutors
- **Become a Tutor** — apply to become a tutor with bio, hourly rate, experience, location, and languages
- **Profile management** — update personal info and avatar

### Tutor Features
- **Dashboard** — earnings overview, session metrics, analytics charts
- **Sessions** — manage confirmed/pending/completed sessions with meeting links
- **Assignments** — create assignments for students, evaluate submissions, provide grades and feedback reports
- **Earnings** — detailed earnings breakdown and history
- **Availability** — create, update, and delete time slots (single session or 30-day recurring packages)
- **Profile management** — update tutor-specific information

### Admin Features
- **Dashboard** — platform-wide analytics (total users, revenue, bookings, active tutors, etc.)
- **User management** — search, filter by role/status, update status (ACTIVE/BANNED), change roles, delete users
- **Booking management** — view all bookings, update status (PENDING/CONFIRMED/COMPLETED/CANCELLED), delete
- **Payment management** — view all platform payments and transaction details
- **Category management** — CRUD operations for tutoring categories
- **Tutor request moderation** — approve or reject "Become a Tutor" applications with rejection reasons
- **Review moderation** — view and delete inappropriate reviews
- **Assignment management** — view and delete assignments platform-wide
- **Notification management** — view all notifications, broadcast to all users, send targeted notifications, delete
- **Profile management** — admin profile settings

### Payment System
- **Stripe integration** with `@stripe/react-stripe-js` and `@stripe/stripe-js`
- **BDT currency** (Bangladeshi Taka) for regional compatibility
- Payment intent creation, webhook handling, and manual sync fallback
- Automatic post-payment processing: booking confirmation, meeting link generation, tutor earnings increment, dual email notifications (invoice + session link)
- Payment status tracking: `INITIATED` → `SUCCESS` / `FAILED`

### Notification System
- Real-time notification bell in dashboard header
- Mark individual or all notifications as read
- System-generated notifications for: payments, bookings, session reminders, tutor request approvals/rejections
- Admin broadcast and targeted notification delivery

### Email Notifications
- Payment invoice emails (student + tutor)
- Session meeting link emails (student + tutor)
- Tutor application approval/rejection emails
- OTP verification emails
- Session reminder emails (5 minutes before start via cron scheduler)
- Assignment notification emails

### Scheduled Tasks
- Automated cron job (runs every minute) checks for sessions starting in ~5 minutes
- Sends system notifications and emails to both student and tutor with meeting link

## Tech Stack

| Layer | Technology |
|---|---|
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

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A running backend API (example: http://localhost:5000)
- A Stripe account with publishable key (for payment features)

Note: The frontend expects a separate backend for auth, API, and payment webhooks; it does not include the backend code.

## Environment Variables

This project validates required env variables using `src/env.ts` with `@t3-oss/env-nextjs`. Create a `.env.local` at the project root (do NOT commit it).

Minimum recommended `.env.local`:

```
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
|---|---|---|
| `AUTH_URL` | Server | Backend base URL for server-side auth calls |
| `BACKEND_URL` | Server | Backend base URL for general server-side requests |
| `API_URL` | Server | Backend API URL for service layer calls |
| `FRONTEND_URL` | Server | Frontend URL (used for redirects and CORS) |
| `NEXT_PUBLIC_BACKEND_URL` | Client | Backend URL used by `next.config.ts` rewrites (browser-side) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | Stripe publishable key for payment element initialization |

Important:

- `NEXT_PUBLIC_BACKEND_URL` must point to your backend host (NOT `http://localhost:3000`). If set to `http://localhost:3000` the Next dev server will proxy requests to itself, causing `EADDRINUSE`, `ECONNRESET`, and `socket hang up` errors.
- `AUTH_URL` is used by server-side services (for example, `src/services/user.services.ts`).
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is required for the Stripe checkout to render the payment element.

## Local Setup (A→Z)

1. Clone the repo:

```bash
git clone <repo-url>
cd skillbridge-client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` using the example above.

4. Start the backend API (see your backend README). Example:

```bash
# from your backend repo
npm run dev
# backend listens on http://localhost:5000
```

5. Start the frontend:

```bash
npm run dev
```

6. Open http://localhost:3000 in your browser.

## Running & Development

- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`

When developing, make sure your backend is running and `NEXT_PUBLIC_BACKEND_URL` points at it.

## Production Build & Deployment

1. Build:

```bash
npm run build
```

2. Start server:

```bash
npm start
```

Deployment notes (Vercel):

- Add environment variables in Vercel dashboard (`NEXT_PUBLIC_BACKEND_URL`, `AUTH_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, etc.).
- Ensure the backend URL used by `NEXT_PUBLIC_BACKEND_URL` is reachable from Vercel.
- Configure Stripe webhook endpoint in your Stripe dashboard pointing to your backend's webhook route.

## Architecture & Folder Layout

Top-level highlights:

- `app/` — Next.js app routes & layouts (App Router) with parallel route slots (`@student`, `@tutor`, `@admin`)
- `src/components/` — shared UI components and layouts
- `src/components/modules/` — feature UI components grouped per domain (home, tutors, payments, student, categories, authentication)
- `src/components/shared/` — cross-cutting components (e.g., NotificationBell)
- `src/services/` — server-side API wrappers (11 service files)
- `src/actions/` — Next.js Server Actions (10 action files)
- `src/routes/` — role-based sidebar navigation configs
- `src/lib/` — helpers (auth-client, stripe, icon-mapper, utils)
- `proxy.ts` — middleware that redirects and enforces route access by role
- `next.config.ts` — rewrites that forward `/api/auth/*` and `/api/*` to the backend defined by `NEXT_PUBLIC_BACKEND_URL`

## Full Project Folder Structure

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

## Detailed Folder Descriptions

Below is a descriptive breakdown of each major folder and what its files do.

- `src/actions/` — **Next.js Server Actions** (10 files)
  - `admin-action.ts` — admin operations (users, bookings, categories, reviews, assignments, notifications, tutor requests)
  - `tutor-action.ts` — tutor session and profile management
  - `student-action.ts` — student profile and tutor request
  - `booking-action.ts` — create booking
  - `payment-action.ts` — create payment intent, sync payment
  - `assignment-action.ts` — submit assignment
  - `availability-action.ts` — CRUD availability slots
  - `notification-action.ts` — mark read, mark all read
  - `category-action.ts` — category operations
  - `user-action.ts` — user operations

- `src/app/(CommonLayout)/` — **Public pages** (no auth required)
  - `page.tsx` — homepage (hero, featured categories, discover tutors, how it works, testimonials, CTA)
  - `(authRouteGroup)/` — login, register, forgot-password, reset-password, verify-email
  - `tutors/` — tutor listing + `[id]` dynamic profile page with booking modal
  - `categories/`, `about/`, `contact/`, `help/`, `how-it-works/`, `privacy/`, `terms/` — informational/legal pages
  - `users/[id]/` — public user profiles

- `src/app/(DashboardLayout)/` — **Protected dashboard** with parallel route slots
  - `layout.tsx` — dashboard shell (sidebar, header, breadcrumb, notification bell, mode toggle, profile dropdown)
  - `@student/dashboard/` — student pages (analytics, bookings, checkout, assignments, payments, reviews, become-tutor, profile)
  - `@tutor/tutor/` — tutor pages (dashboard, sessions, assignments, earnings, availability, profile, create profile)
  - `@admin/admin/` — admin pages (dashboard, users, bookings, payments, categories, tutor-requests, reviews, assignments, notifications, profile)

- `src/components/layouts/` — **App shell components**
  - `app-sidebar.tsx` — collapsible sidebar with role-based navigation
  - `Navbar.tsx` — public-facing navigation bar
  - `footer.tsx` — site footer
  - `ModeToggle.tsx` — dark/light theme switcher
  - `DashboardHeaderProfile.tsx` — header profile dropdown
  - `logo.tsx` — SkillBridge logo component

- `src/components/modules/` — **Feature UI components**
  - `authentication/` — login-form, signup-form, forgot-password-form, reset-password-form, verify-email-form
  - `home/` — HeroSection, CtaSection, DiscoverTutorsSection, FeaturedCategoriesSection, HowItWorksSection, TestimonialsSection
  - `tutors/` — Tutors listing, TutorProfileView, BookSessionModal
  - `payments/` — CheckoutForm (Stripe Elements wrapper)
  - `student/` — StudentProfileView
  - `categories/` — CategoriesView

- `src/components/ui/` — **Design system primitives** (27 components)
  - Radix-based: accordion, alert-dialog, avatar, badge, breadcrumb, button, card, collapsible, context-menu, dialog, dropdown-menu, navigation-menu, radio-group, select, separator, sheet, sidebar, skeleton, table, tooltip
  - Custom: field, input, label, search-form, sonner (toast), textarea, version-switcher

- `src/components/shared/` — **Cross-cutting components**
  - `NotificationBell.tsx` — real-time notification dropdown with unread count

- `src/services/` — **Server-side API wrappers** (11 files)
  - `admin.services.ts` — comprehensive admin API (users, bookings, payments, categories, reviews, assignments, notifications, tutor requests)
  - `tutor.services.ts` — tutor profile, availability, sessions
  - `student.services.ts` — student bookings, reviews, tutor application, profile
  - `payment.services.ts` — payment intent, sync, history
  - `booking.services.ts` — booking creation
  - `assignment.services.ts` — assignment listing, details, submission
  - `availability.services.ts` — CRUD for tutor availability slots
  - `notification.services.ts` — get, mark read, mark all read
  - `category.services.ts` — category listing
  - `user.services.ts` — session utilities and server-side auth calls
  - `user.services.middleware.ts` — auth middleware helpers

- `src/routes/` — **Sidebar navigation configs per role**
  - `adminRoute.ts` — Dashboard, Users, Bookings, Payments, Categories, Tutor Requests, Reviews, Notifications, Assignments, Profile
  - `studentRoute.ts` — Dashboard, My Bookings, Assignments, Payments, My Reviews, Become a Tutor, Profile
  - `tutorRoute.ts` — Dashboard, Sessions, Assignments, Earnings, Availability, Profile

- `src/lib/` — **Utility libraries**
  - `auth-client.ts` — configured client wrapper for auth calls
  - `stripe.ts` — Stripe client initialization with `loadStripe`
  - `icon-mapper.ts` — centralized Lucide icon resolver (maps string names to components)
  - `utils.ts` — shared helpers (cn for className merging)

- `src/types/` — **TypeScript type definitions**
  - `index.ts`, `routeType.ts`, `tutorType.ts`, `userType.ts`

- `src/zod/` — **Validation schemas**
  - `auth.validation.ts` — Zod schemas for auth forms

- `src/constance/` — **Constants**
  - `role.ts` — role enums (STUDENT, TUTOR, ADMIN)

- `src/hooks/` — **Custom React hooks**
  - `use-mobile.ts` / `use-mobile.tsx` — responsive breakpoint detection

- `src/providers/` — **React context providers**
  - `ThemeProvider.tsx` — next-themes provider for dark/light mode

- `src/env.ts` — runtime env validation using `@t3-oss/env-nextjs`
- `proxy.ts` — middleware for role-based route protection
- `next.config.ts` — Next.js config with API rewrites and image optimization

## Authentication & Proxy Behavior

- Browser requests to `/api/auth/:path*` are rewritten (in `next.config.ts`) to `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/:path*`.
- All `/api/:path*` requests are also proxied to the backend.
- Server-side code (inside Next Server runtime) calls the backend directly using `AUTH_URL` / `API_URL`.
- `proxy.ts` checks session and user role and redirects users accordingly.
- Authentication supports: email/password login, social sign-in, forgot password, reset password, and email verification flows.

## Role-Based Dashboards

The dashboard uses Next.js **parallel routes** (`@student`, `@tutor`, `@admin`) to render different content based on the authenticated user's role. The layout component (`(DashboardLayout)/layout.tsx`) fetches the current user session and conditionally renders the appropriate parallel route slot.

**Dashboard Shell Features:**
- Collapsible sidebar with role-specific navigation
- Sticky header with quick search, dark/light mode toggle, notification bell, and profile dropdown
- Context bar with breadcrumb navigation, role badge, and Help Center / Explore Tutors quick links
- Glassmorphic card design with decorative background blobs
- Responsive layout with `max-w-screen-2xl` content area

## Payment & Checkout (Stripe)

### Flow
1. Student selects a tutor availability slot and confirms booking in the `BookSessionModal`
2. A booking record is created via `createBookingAction`
3. Student is redirected to `/dashboard/checkout/[bookingId]`
4. The checkout page creates a Stripe Payment Intent via `createPaymentIntent`
5. The `CheckoutForm` renders Stripe Elements with the client secret
6. On successful payment:
   - Backend marks booking as `CONFIRMED` and payment as `PAID`
   - Auto-generates a meeting link (Google Meet format)
   - Increments tutor's `totalEarnings`
   - Creates system notifications for both student and tutor
   - Sends invoice email to student + session confirmation email to tutor
   - Sends dedicated meeting link emails to both parties
7. Webhook handler provides a redundant payment confirmation path
8. A manual `syncPayment` fallback is available when webhooks are delayed

### Pricing
- **Single Session**: `hourlyRate × durationHours × 1`
- **30-Day Package**: `hourlyRate × durationHours × 30`
- Currency: **BDT** (Bangladeshi Taka), displayed as `৳`

## Session Booking Workflow

1. Student browses the tutor listing page (`/tutors`) with search and filter capabilities
2. Student opens a tutor profile page (`/tutors/[id]`) to view bio, expertise, rating, hourly rate, and available slots
3. Student clicks "Book a Session" to open the booking modal
4. Modal displays available slots with type badges (`1 Session` / `30 Days`) and dynamic total price
5. On confirm, a booking is created and student is redirected to checkout
6. After payment, both parties receive meeting links via notifications and email

## Assignment System

### Tutor Side
- **Create assignments** — title, description, due date, resource file upload (PDF via Cloudinary)
- **View submissions** — see student submissions with timestamps
- **Evaluate** — grade assignments, provide feedback, upload evaluation reports (PDF)
- **Analytics charts** — submission and grading statistics

### Student Side
- **View assignments** — list of assignments with status (pending/submitted/graded), due dates, and resource links
- **Submit solutions** — upload PDF submissions via Cloudinary
- **Track grades** — view grades and tutor feedback

## Notification System

- **NotificationBell** component in dashboard header with unread count badge
- Dropdown shows recent notifications with timestamps
- Actions: mark individual as read, mark all as read
- Notification types: `PAYMENT`, `BOOKING`, `ASSIGNMENT`, `GENERAL`
- Admin can broadcast notifications to all users or send to specific users

## Tutor Availability Management

Tutors manage their availability through dedicated services:
- **Create slots** — define start/end time windows with type (`SINGLE` or `PACKAGE_30D`)
- **Update slots** — modify existing availability
- **Delete slots** — remove availability
- Slots are displayed on the tutor's public profile for students to book

## "Become a Tutor" Request Workflow

1. Student fills out the application form: bio, hourly rate, experience years, location, languages
2. Application is submitted via `requestToBecomeTutor`
3. Student can track their request status via `getMyTutorRequest`
4. Admin reviews pending requests in the **Tutor Requests** panel
5. Admin can **approve** (promotes user to TUTOR role, sends approval email) or **reject** (with reason, sends rejection email)

## Admin Panel

The admin dashboard provides a comprehensive control center:

| Section | Features |
|---|---|
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

## Email Templates

The backend uses EJS templates for transactional emails:

| Template | Purpose |
|---|---|
| `invoice.ejs` | Payment invoice with booking details and amount |
| `sessionLink.ejs` | Dedicated meeting link delivery to student and tutor |
| `otp.ejs` | OTP verification code for email verification |
| `tutorApprovalEmail.ejs` | Tutor application approved notification |
| `tutorRejectionEmail.ejs` | Tutor application rejected (with reason) notification |
| `assignment.ejs` | Assignment-related notifications |
| `googleRedirect.ejs` | OAuth redirect handler |

## Scheduled Tasks (Cron)

The backend runs a cron scheduler (`node-cron`) with the following automated task:

- **Session Reminder** — runs every minute, finds CONFIRMED bookings starting in ~5 minutes, sends system notifications and emails to both student and tutor with the meeting link.

## Public Pages

The following pages are publicly accessible (no authentication required):

| Route | Description |
|---|---|
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

## Developer Accounts & Onboarding (Professional)

This section describes the developer account setup and onboarding checklist for engineers and integrators.

1. Source & CI
   - GitHub: ensure all developers have access to the project repository. Create teams: `frontend`, `backend`, `devops`.
   - Branching: main protected, PRs required with code review and passing CI checks.
   - CI: connect GitHub Actions or Vercel to run linting and build on PRs.

2. Hosting & Environment
   - Vercel (recommended): create a Vercel project linked to the GitHub repo.
   - Add environment variables in Vercel for each environment (Preview, Production):
     - `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `AUTH_URL`, `BACKEND_URL`, `API_URL`, `FRONTEND_URL`
   - Create separate environments for `staging` and `production` with appropriate backend URLs.

3. Backend & Database Access
   - Backend dev server: give developers instructions to run locally (repo, start command, DB connection string).
   - Database: provide a shared dev database (Postgres/Prisma) or local dev container instructions (`docker-compose`), and create sample seed data for test accounts.

4. OAuth & Third-Party Services
   - OAuth providers (Google, Facebook): create credentials in the provider console and store client IDs/secrets in environment variables for each environment.
   - Stripe: create test-mode API keys and configure webhooks for the development backend endpoint.
   - Email provider: configure SMTP or transactional email provider (SendGrid, Mailgun, Nodemailer) and store credentials in env.
   - Cloudinary: configure upload preset for PDF file hosting (assignments, evaluation reports).
   - Sentry/Monitoring: add DSN in env for error reporting (optional).

5. Developer Onboarding Checklist
   - [ ] Obtain GitHub access and clone the repo
   - [ ] Add SSH keys (if required) or use HTTPS auth
   - [ ] Create `.env.local` using the example; request dev backend URL if you don't run backend locally
   - [ ] Obtain Stripe test publishable key and add to `.env.local`
   - [ ] Run backend locally or point `NEXT_PUBLIC_BACKEND_URL` to shared dev API
   - [ ] Run `npm install` and `npm run dev` and confirm the app renders
   - [ ] Use seeded accounts (admin, tutor, student) to test role pages
   - [ ] Test the full booking → payment → meeting link flow in Stripe test mode

6. Test Accounts (suggested)
   - `admin@example.com` — admin user
   - `tutor@example.com` — tutor user
   - `student@example.com` — student user

7. Security / Access Control
   - Never commit `.env.local` or secrets. Use secret management in CI and hosting.
   - Use least privilege for service accounts and rotate keys periodically.
   - All payments are processed via Stripe (PCI-compliant) — no card data touches your servers.

## Common Issues & Troubleshooting

1. **ECONNRESET / socket hang up / EADDRINUSE**
   - Cause: `NEXT_PUBLIC_BACKEND_URL` points to your Next dev server (self-proxy). Fix: set `NEXT_PUBLIC_BACKEND_URL` to your backend URL.

2. **Environment validation failing on dev or build**
   - The project uses `@t3-oss/env-nextjs` to validate env at runtime. Make sure all required env vars from `src/env.ts` exist in `.env.local`, including `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `NEXT_PUBLIC_BACKEND_URL`.

3. **Cookies / session not propagated**
   - Server-side requests to the backend include cookies via `cookies()` (Next server headers). Ensure backend permits and recognizes cookie-based auth for the host domain.

4. **Static assets not loading**
   - Check `next.config.ts` `images.remotePatterns` (currently set to wildcard `**`) and `public/` folder.

5. **Stripe payment element not rendering**
   - Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set and valid. Check browser console for Stripe initialization errors.

6. **PDF assignments returning 401 Unauthorized**
   - Ensure Cloudinary uploads use `auto` resource type (not `raw`) for public CDN accessibility.

7. **Payment shows "Payment Unavailable"**
   - Check that the backend API is reachable from the frontend's server-side (not blocked by Vercel deployment protection). Verify the Stripe secret key is configured on the backend.

8. **Meeting link not generated after payment**
   - Meeting links are generated in the `processSuccessfulPayment` backend function. Ensure the Stripe webhook is configured or that the `syncPayment` fallback executes correctly.

## Testing, Linting & Formatting

- Lint: `npm run lint` (project includes ESLint 9)
- Formatting: follow existing project conventions (Prettier not included by default here). Add Prettier if needed.

## Contributing

- Fork the repo and open a PR.
- Keep changes focused and small — one feature/bug per PR.
- Run the app locally and verify flows (login, role-based pages, booking → payment → meeting link, assignment submission, etc.) before requesting review.

## Contact

For questions or help, open an issue on the repository or contact the maintainers listed in the project (or your team Slack/email).

---

**Last Updated**: March 31, 2026  
**Maintainer**: alamin-87  
**Repository**: https://github.com/alamin-87/SkillBridge-client
