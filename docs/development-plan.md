# LLC Student Registration System: 1-Developer Execution Plan

Based on the architecture, database design, and folder structure, here is a **day-by-day plan for a single full-stack developer**.

Because one person builds both sides, work is organized in **vertical slices**: finish the backend endpoint and its React screen together before moving on. This avoids integration surprises and keeps something demo-ready at the end of every phase.

**Estimated duration:** about 26 working days (roughly 5 to 6 weeks at a comfortable pace).

---

## Phase 1: Project Setup & Foundation (Days 1-3)
*Goal: Repository, folder structure, database schema, app shells.*

**Day 1: Scaffolding**
*   Create the repo with `backend/`, `frontend/`, `docs/`.
*   Backend: initialize Node.js/Express, folder structure from `fl-architecture.md`, `.env`, `app.js`, `server.js`, Helmet/CORS.
*   Frontend: initialize React (Vite, JavaScript), React Router, Tailwind or chosen CSS.

**Day 2: Database**
*   Set up MySQL connection pool (`mysql2`).
*   Write numbered SQL migrations for all tables in `database-design.md`.
*   Seed sample courses/batches and the first admin (from env vars).

**Day 3: Shared UI & API Client**
*   Build shared components: Button, Input, Select, Modal, Spinner, StatusBadge, Navbar, Footer.
*   Configure Axios with credentials and a global error handler.

---

## Phase 2: Public Catalog (Days 4-6)
*Goal: Visitors can browse LLC courses and open batches.*

**Day 4: Catalog API**
*   `/api/courses`, `/api/courses/{id}`, `/api/courses/{id}/batches`, `/api/batches/{id}`.

**Day 5: Catalog UI**
*   Home page, course list, course details, batch selector (mobile-first).

**Day 6: Buffer & Review**
*   Fix layout issues; confirm only active courses and open batches appear.

---

## Phase 3: Authentication (Days 7-10)
*Goal: Secure login, email verification, account recovery.*

**Day 7: Auth Core (Backend)**
*   Password hashing (bcrypt/argon2), `/api/auth/login|logout|me`, JWT in HTTP-only cookie.
*   `requireAuth` and `requireRole` middleware; rate limiting on auth routes.

**Day 8: Auth UI**
*   Login page, auth context/store, `ProtectedRoute` and `AdminRoute` guards.

**Day 9: Verification & Recovery (Backend)**
*   Email service wrapper; verification and password-reset token flows (hashed, expiring, single-use).

**Day 10: Verification & Recovery (UI)**
*   Verify-email, forgot-password, and reset-password pages; test the full recovery loop.

---

## Phase 4: The Core Registration Engine (Days 11-15)
*Goal: Atomic, safe registration with unique numbers.*

**Day 11: Registration Transaction**
*   `/api/registrations/apply`: validate, recheck batch/course, single transaction (users, students, registrations), counter-based registration number, rollback on any error.

**Day 12: Registration Form**
*   Combined account + registration form with client-side validation and clear server error display.

**Day 13: Confirmation & Failure Testing**
*   Confirmation page showing the registration number.
*   Tests: closed batch, duplicate email, duplicate student+batch, simulated mid-transaction failure (no partial rows), concurrent number generation.

**Day 14: Student Dashboard**
*   `/api/registrations/me`, `/api/students/me`, extra registration for another course, cancel pending.
*   Dashboard UI showing only the student's own registrations and statuses.

**Day 15: Buffer & End-to-End Check**
*   Register, verify email, log in, view status; confirm one student cannot access another's records.

---

## Phase 5: Admin Operations (Days 16-22)
*Goal: Administrators can review and manage applications.*

**Day 16: Admin Course & Batch API**
*   Create/edit/activate/deactivate courses and batches; open/close registration.

**Day 17: Admin Course & Batch UI**
*   Admin layout (sidebar), course and batch management forms and tables.

**Day 18: Registration Review API**
*   `/api/admin/registrations` with search, filters, pagination (indexed queries); detail endpoint.

**Day 19: Registration Review UI**
*   Registration table with filters (name, number, phone, course, batch, date, status); detail view.

**Day 20: Status Updates & History**
*   `PATCH /status` with history and audit log; status update modal; optional status-change email.

**Day 21: Stats & CSV Export**
*   `/api/admin/stats`; dashboard stat cards; CSV export with formula-injection protection (escape `=`, `+`, `-`, `@`).

**Day 22: Buffer & Admin Review**
*   Verify every admin route rejects students and anonymous users.

---

## Phase 6: QA, Security & Deployment (Days 23-26)
*Goal: Production readiness.*

**Day 23: Security Review**
*   Check authorization on every route, SQL injection, rate limits, no secrets in the frontend bundle, cookie flags, generic auth error messages.

**Day 24: Testing & Polish**
*   Mobile/tablet responsiveness, accessibility basics, loading and error states, final acceptance-criteria walkthrough from `requirements.md`.

**Day 25: Deployment**
*   Provision hosting and MySQL; Nginx reverse proxy with HTTPS; Node via PM2; least-privilege DB user; production build served by Nginx; automated backups.

**Day 26: Launch & Monitoring**
*   Live testing; confirm the system stays online independently of your computer; test a backup restore; monitor logs.

---

### Tips for Solo Development
1. **Vertical slices**: finish API + UI for one feature before starting the next.
2. **Write the API contract first** (`api-plan.md`) so frontend and backend never drift.
3. **Protect the critical path**: spend extra time on the registration transaction and authorization; they matter most.
4. **Commit small and often**, with numbered SQL migrations in Git; never edit the live DB by hand.
5. **Cut order if time runs short**: drop optional status-change emails first, then student cancellation, then dashboard charts. Never cut security or transaction testing.
6. **Daily 10-minute self check-in**: what finished, what's next, what's blocking.
