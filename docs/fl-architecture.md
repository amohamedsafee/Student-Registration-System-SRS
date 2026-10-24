# LLC Student Registration System: Folder Architecture

This document outlines the folder structure for the **Frontend (React)** and **Backend (Node.js/Express.js)**. Both are written in **JavaScript only** (no TypeScript).

The architecture is **Feature-Based (Modular)**: code is grouped by business domain (auth, courses, registrations) rather than by technical role.

---

## 1. High-Level Project Structure

```text
llc-student-registration-system/
├── backend/                # Node.js + Express API (MySQL)
├── frontend/               # React web application
├── docs/                   # Documentation (Requirements, Architecture, APIs, etc.)
├── .gitignore
└── README.md
```

---

## 2. Backend Architecture (Node.js + Express)

```text
backend/
├── src/
│   ├── app.js                 # Express app setup and global middleware
│   ├── server.js              # Server entry point (app.listen)
│   ├── config/
│   │   ├── database.js        # MySQL connection pool (mysql2)
│   │   └── config.js          # .env loader (dotenv)
│   ├── core/
│   │   ├── errors/            # Custom error classes (AppError, ValidationError)
│   │   ├── middlewares/       # requireAuth, requireRole, rateLimit, validate, errorHandler
│   │   └── utils/             # logger, registration number formatter, csv helper, token helper
│   │
│   ├── modules/               # FEATURE MODULES (Domain Driven)
│   │   ├── auth/              # Login, logout, email verification, password reset
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.model.js        # users + token tables
│   │   ├── students/          # Student profile
│   │   │   ├── student.routes.js
│   │   │   ├── student.controller.js
│   │   │   ├── student.service.js
│   │   │   └── student.model.js
│   │   ├── courses/           # Course catalog (public + admin)
│   │   ├── batches/           # Batch catalog and registration-open flag
│   │   ├── registrations/     # Core Registration Engine
│   │   │   ├── registration.routes.js
│   │   │   ├── registration.controller.js
│   │   │   ├── registration.service.js   # Transaction: user + student + registration + number
│   │   │   └── registration.model.js
│   │   └── admin/             # Review, status updates, stats, CSV export, audit
│   │
│   └── third-party/
│       └── email.service.js   # Email provider wrapper (verification, reset)
│
├── db/
│   ├── migrations/            # Versioned SQL schema files (001_create_users.sql, ...)
│   └── seeds/                 # Initial admin (from env vars), sample courses
├── tests/                     # Unit and integration tests
├── .env.example
├── package.json
└── README.md
```

### Backend Design Rules:
- **Routes (`*.routes.js`)**: Only define HTTP endpoints and attach middlewares. No business logic.
- **Controllers (`*.controller.js`)**: Extract request data, call the service, format the HTTP response.
- **Services (`*.service.js`)**: Core business logic, independent of `req`/`res`. The registration service owns the database transaction.
- **Models (`*.model.js`)**: The only files that run SQL. Always use parameterized queries; accept a transaction connection where needed.
- **Authorization**: `requireAuth` and `requireRole('admin')` run in routes; ownership checks (student sees only own records) run in services/models.
- **Secrets**: Only read through `config/config.js` from environment variables.

---

## 3. Frontend Architecture (React)

```text
frontend/
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── assets/
│   │   ├── styles/
│   │   └── images/
│   │
│   ├── core/
│   │   ├── api/               # Axios instance (withCredentials) & interceptors
│   │   ├── constants/         # ROLES, REGISTRATION_STATUSES
│   │   └── routes/            # React Router config, ProtectedRoute, AdminRoute
│   │
│   ├── components/            # SHARED / DUMB COMPONENTS
│   │   ├── ui/                # Buttons, Inputs, Select, Modal, Spinner, StatusBadge
│   │   └── layout/            # Navbar, Sidebar, Footer
│   │
│   ├── features/              # FEATURE MODULES (Smart components)
│   │   ├── auth/              # LoginForm, ForgotPasswordForm, ResetPasswordForm, useAuth
│   │   ├── courses/           # CourseList, CourseDetails, BatchSelector
│   │   ├── registration/      # RegistrationForm (account + details), ConfirmationCard
│   │   ├── student-dashboard/ # MyRegistrations, ProfileCard
│   │   └── admin-dashboard/   # StatsCards, RegistrationTable, Filters, StatusUpdateModal,
│   │                          # CourseManager, BatchManager, ExportButton
│   │
│   ├── pages/                 # Route-level components
│   │   ├── Home.jsx
│   │   ├── Courses.jsx
│   │   ├── CourseDetails.jsx
│   │   ├── Register.jsx
│   │   ├── RegistrationSuccess.jsx
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── VerifyEmail.jsx
│   │   ├── StudentDashboard.jsx
│   │   └── admin/             # AdminLogin, AdminDashboard, Registrations, Courses, Batches
│   │
│   ├── hooks/
│   ├── store/                 # Global state (auth user/role) - Context or Zustand
│   └── utils/                 # date formatting, phone validation
│
├── .env.example               # VITE_API_BASE_URL only (no secrets)
├── package.json
├── vite.config.js
└── README.md
```

### Frontend Design Rules:
- **`components/ui/`**: Reusable "dumb" components; props in, events out; no data fetching.
- **`features/`**: Contains UI business logic; may fetch data and read global state.
- **`pages/`**: Thin; composes feature components.
- **API Calls**: Centralized in `features/{feature}/api/` or `core/api/`.
- **No secrets in the browser**: The frontend knows only the API URL; it never holds database credentials or JWT secrets. UI route guards are for convenience only; real protection is on the server.

---

## 4. Why this is Suitable
1. **Scalability**: Organizing by feature keeps the codebase tidy as LLC adds features later.
2. **Clear Transaction Ownership**: The registration module owns the multi-table write, making atomicity easy to test.
3. **Team Collaboration**: Two developers can work on different modules with minimal merge conflicts.
4. **Testability**: Services and hooks can be unit-tested without the full web framework.
