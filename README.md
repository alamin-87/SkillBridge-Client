# SkillBridge — Client (A→Z Guide)

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
- Developer Accounts & Onboarding (Professional)
- Common Issues & Troubleshooting
- Testing, Linting & Formatting
- Contributing
- Contact
- License

---

## Project Summary

This repository contains the frontend client for SkillBridge — a tutoring marketplace that connects students, tutors, and admins. The UI is built with Next.js (App Router), TypeScript, TailwindCSS and integrates with a separate backend API for authentication and data.

## Features

- Role-based layouts and route protection (student, tutor, admin)
- Authentication flows (email, social sign-in) proxied to the backend
- Reusable UI components, modules, and services
- Server- and client-side API calls with environment validation

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- t3-oss/env-nextjs for environment validation
- better-auth (client helper)

## Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A running backend API (example: http://localhost:5000)

Note: The frontend expects a separate backend for auth and API; it does not include the backend code.

## Environment Variables

This project validates required env variables using `src/env.ts`. Create a `.env.local` at the project root (do NOT commit it).

Minimum recommended `.env.local`:

```
# Backend base used by next.config rewrites
NEXT_PUBLIC_TEST=http://localhost:5000

# Server-side service URLs (required by env validation)
AUTH_URL=http://localhost:5000
BACKEND_URL=http://localhost:5000
API_URL=http://localhost:5000/api

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

Important:
- `NEXT_PUBLIC_TEST` must point to your backend host (NOT `http://localhost:3000`). If set to `http://localhost:3000` the Next dev server will proxy requests to itself, causing `EADDRINUSE`, `ECONNRESET`, and `socket hang up` errors.
- `AUTH_URL` is used by server-side services (for example, `src/services/user.services.ts`).

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

When developing, make sure your backend is running and `NEXT_PUBLIC_TEST` points at it.

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
- Add environment variables in Vercel dashboard (`NEXT_PUBLIC_TEST`, `AUTH_URL`, etc.).
- Ensure the backend URL used by `NEXT_PUBLIC_TEST` is reachable from Vercel.

## Architecture & Folder Layout

Top-level highlights:

- `app/` — Next.js app routes & layouts (App Router)
- `src/components/` — shared UI components and layouts
- `src/modules/` — grouped feature modules (authentication, tutors, home, student views)
- `src/services/` — API wrappers (ex: `user.services.ts`, `auth`, `tutor.services.ts`)
- `src/lib/` — helpers (for example `auth-client.ts`)
- `proxy.ts` — middleware that redirects and enforces route access by role
- `next.config.ts` — rewrites that forward `/api/auth/*` to the backend defined by `NEXT_PUBLIC_TEST`

## Detailed Folder Structure

Below is a concise but complete view of the key folders and files you'll work with as a developer. File lists are illustrative, not exhaustive.

- `app/`
   - `layout.tsx` — root layout
   - `not-found.tsx` — fallback
   - `(CommonLayout)/` — public pages (home, login, register, tutors list)
   - `(DashboardLayout)/` — protected dashboard routes and nested role folders

- `src/components/`
   - `layouts/` — app sidebar, navbar, footer, mode toggle
   - `ui/` — design system primitives: button, input, dialog, dropdown
   - `modules/` — feature UI components grouped per domain

- `src/modules/` — high level feature modules
   - `authentication/` — `login-form.tsx`, `signup-form.tsx`
   - `categories/` — categories view
   - `home/` — hero, CTA, discover sections

- `src/services/`
   - `user.services.ts` — session utilities and server-side auth calls
   - `auth.services.ts`, `tutor.services.ts`, `booking.services.ts` — API wrappers

- `src/lib/`
   - `auth-client.ts` — configured client wrapper for auth calls
   - `utils.ts` — shared helpers

- `src/env.ts` — runtime env validation using `t3-oss/env-nextjs`
- `public/` — static assets, images, lottie files

## Authentication & Proxy Behavior

- Browser requests to `/api/auth/:path*` are rewritten (in `next.config.ts`) to `${process.env.NEXT_PUBLIC_TEST}/api/auth/:path*`.
- Server-side code (inside Next Server runtime) calls the backend directly using `AUTH_URL`.
- `proxy.ts` checks session and user role and redirects users accordingly.

## Developer Accounts & Onboarding (Professional)

This section describes the developer account setup and onboarding checklist for engineers and integrators.

1) Source & CI
   - GitHub: ensure all developers have access to the project repository. Create teams: `frontend`, `backend`, `devops`.
   - Branching: main protected, PRs required with code review and passing CI checks.
   - CI: connect GitHub Actions or Vercel to run linting and build on PRs.

2) Hosting & Environment
   - Vercel (recommended): create a Vercel project linked to the GitHub repo.
   - Add environment variables in Vercel for each environment (Preview, Production):
      - `NEXT_PUBLIC_TEST`, `AUTH_URL`, `BACKEND_URL`, `API_URL`, `FRONTEND_URL`
   - Create separate environments for `staging` and `production` with appropriate backend URLs.

3) Backend & Database Access
   - Backend dev server: give developers instructions to run locally (repo, start command, DB connection string).
   - Database: provide a shared dev database (Postgres) or local dev container instructions (`docker-compose`), and create sample seed data for test accounts.

4) OAuth & Third-Party Services
   - OAuth providers (Google, Facebook): create credentials in the provider console and store client IDs/secrets in environment variables for each environment.
   - Email provider: configure SMTP or transactional email provider (SendGrid, Mailgun) and store credentials in env.
   - Sentry/Monitoring: add DSN in env for error reporting (optional).

5) Developer Onboarding Checklist
   - [ ] Obtain GitHub access and clone the repo
   - [ ] Add SSH keys (if required) or use HTTPS auth
   - [ ] Create `.env.local` using the example; request dev backend URL if you don't run backend locally
   - [ ] Run backend locally or point `NEXT_PUBLIC_TEST` to shared dev API
   - [ ] Run `npm install` and `npm run dev` and confirm the app renders
   - [ ] Use seeded accounts (admin, tutor, student) to test role pages

6) Test Accounts (suggested)
   - `admin@example.com` — admin user
   - `tutor@example.com` — tutor user
   - `student@example.com` — student user

7) Security / Access Control
   - Never commit `.env.local` or secrets. Use secret management in CI and hosting.
   - Use least privilege for service accounts and rotate keys periodically.

## Common Issues & Troubleshooting

1. ECONNRESET / socket hang up / EADDRINUSE
    - Cause: `NEXT_PUBLIC_TEST` points to your Next dev server (self-proxy). Fix: set `NEXT_PUBLIC_TEST` to your backend URL.

2. Environment validation failing on dev or build
    - The project uses `t3-oss/env-nextjs` to validate env at runtime. Make sure all required env vars from `src/env.ts` exist in `.env.local`.

3. Cookies / session not propagated
    - Server-side requests to the backend include cookies via `cookies()` (Next server headers). Ensure backend permits and recognizes cookie-based auth for the host domain.

4. Static assets not loading
    - Check `next.config.ts` `images.remotePatterns` and `public/` folder.

## Testing, Linting & Formatting

- Lint: `npm run lint` (project includes ESLint)
- Formatting: follow existing project conventions (Prettier not included by default here). Add Prettier if needed.

## Contributing

- Fork the repo and open a PR.
- Keep changes focused and small — one feature/bug per PR.
- Run the app locally and verify flows (login, role-based pages, API interactions) before requesting review.

## Contact

For questions or help, open an issue on the repository or contact the maintainers listed in the project (or your team Slack/email).

---

