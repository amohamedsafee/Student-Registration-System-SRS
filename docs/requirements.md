# LLC Student Registration System: Requirements Specification

## 1. Executive Summary

The LLC Online Student Registration System is a web application for **Language Learning Campus (LLC), Kalmunai, Sri Lanka**. Students view courses, select an open batch, create an account with email and password inside the registration form, submit a registration, and later sign in to check its status. Authorized administrators manage courses, batches, and registrations.

The project is focused on **online registration**, not a complete Student Management System.

The system emphasizes:

1. A reliable, atomic registration workflow first (no false success, no half-created records)
2. A clean, constrained relational data foundation second
3. Strict privacy: students see only their own data; admin functions are enforced on the server

---

## 2. System Architecture & Tech Stack

The preferred architecture is a **3-Tier Application** delivered as a **Modular Monolith**.

| Component | Technology / Approach |
|---|---|
| **Backend** | Node.js |
| **API Framework** | Express.js |
| **Frontend** | React (Vite) |
| **Language** | JavaScript only (no TypeScript) |
| **Database** | MySQL 8.4 LTS (SQL-based, relational) |
| **DB Access** | `mysql2` with parameterized queries (or Knex.js query builder) |
| **API Communication** | REST API (JSON) |
| **Authentication** | Custom email/password auth: bcrypt/argon2 hashing + JWT in HTTP-only, Secure, SameSite cookies |
| **Authorization** | Server-side role middleware (`student`, `admin`) + ownership checks |
| **Email** | Transactional email provider (verification + password reset) |
| **Hosting** | Online VPS or managed host + managed MySQL; must not depend on the developer's computer |

> **Change from the SRD:** The SRD v1.1 names Supabase PostgreSQL, Supabase Auth, and Next.js. Per project decision, the database is **MySQL**. Because Supabase Auth and Row Level Security are PostgreSQL/Supabase features, this project replaces them with application-level authentication and server-side authorization (see `architecture.md` section 5).

---

## 3. Scope

### 3.1 Included Features
- LLC homepage, course listings, course details, and batch selection
- Combined student account creation + registration form
- Email/password login, logout, and account recovery
- Email verification (configurable: optional or required before dashboard access)
- Registration confirmation with a unique registration number
- Student dashboard showing only the student's own registrations and statuses
- Administrator login and dashboard: search, filters, status updates, course/batch management, CSV export

### 3.2 Out of Scope
- Attendance management
- Online payments
- Lecturer, staff, and salary management
- Examination and performance tracking
- Certificate generation
- Automated WhatsApp or SMS notifications

---

## 4. User Types

### 4.1 Student
- Create an account with email and password during registration
- Submit a course/batch registration
- Sign in later and view only their own registrations and statuses
- Recover account access securely

### 4.2 Administrator
- Sign in with an authorized administrator account
- View statistics and registration records
- Search and filter registrations
- Review applications and update statuses
- Manage courses, batches, and registration availability
- Export permitted records to CSV

---

## 5. Core Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Display LLC information, active courses, course details, and available batches. |
| FR-02 | Collect student details, email, password, and selected course/batch in one registration experience. |
| FR-03 | Validate data on the server; reject invalid submissions or closed batches. |
| FR-04 | Create the user account, student profile, and registration record through a safe server-side workflow. |
| FR-05 | Handle partial failures safely; avoid duplicate or incomplete registrations. |
| FR-06 | Generate a unique registration number and timestamp automatically. |
| FR-07 | Set new registrations to `PENDING`; account creation does not mean admission is confirmed. |
| FR-08 | Show confirmation and the registration number after successful submission. |
| FR-09 | Allow students to log in, log out, and recover account access. |
| FR-10 | Show students only their own registration records in their dashboard. |
| FR-11 | Allow authorized administrators to log in and access dashboard functions. |
| FR-12 | Show registration statistics and records to authorized administrators. |
| FR-13 | Search/filter by name, registration number, phone, course, batch, date, and status. |
| FR-14 | Allow authorized administrators to view details and update statuses. |
| FR-15 | Allow authorized administrators to create, edit, activate, and deactivate courses and batches. |
| FR-16 | Export authorized registration records to CSV. |
| FR-17 | Support `PENDING`, `UNDER_REVIEW`, `CONFIRMED`, `REJECTED`, and `CANCELLED` statuses. |

### 5.1 Registration Form Fields

| Field | Rule |
|---|---|
| Full name | Required |
| Date of birth | Required only if LLC needs it |
| Gender | Optional, if required |
| Phone number | Required |
| WhatsApp number | Optional |
| Email address | Required (used for the student account) |
| Password | Required at account creation; never stored raw |
| Home address | Required only if needed by LLC |
| Selected course and batch | Required |

Registration date and registration number are generated automatically. Do **not** collect NIC or passport numbers unless LLC genuinely requires them.

### 5.2 Registration Workflow

1. Student selects an active course and an open batch.
2. Student enters personal details, email, and password.
3. The server validates input and rechecks batch availability.
4. The server begins a **single MySQL transaction**: creates the `users` record (password hashed), the `students` profile, and the `registrations` record with a generated registration number and status `PENDING`.
5. On any failure the transaction is rolled back; the student never sees a false success.
6. If email verification is enabled, a verification email is queued/sent; the student verifies before full account access.
7. The student sees confirmation with the registration number and can later sign in to check status.
8. An authorized administrator reviews the application and updates its status.

Submitting the form or verifying email does **not** automatically confirm admission.

### 5.3 Registration Statuses

| Status | Meaning |
|---|---|
| `PENDING` | Submitted and waiting for review |
| `UNDER_REVIEW` | An administrator is reviewing the application |
| `CONFIRMED` | Registration has been accepted |
| `REJECTED` | Application has not been accepted |
| `CANCELLED` | Registration has been cancelled |

---

## 6. Data Requirements

| Table | Purpose |
|---|---|
| `users` | Login identity: email, password hash, role, verification state (replaces Supabase Auth) |
| `students` | Student profile details, linked 1:1 to `users` via `auth_user_id` |
| `courses` | Course name, description, duration, active status, creation timestamp |
| `batches` | Course FK, batch name, start date, schedule, registration-open flag, timestamps |
| `registrations` | Unique registration number, student FK, batch FK, registration date, status, timestamps |

Supporting tables: `registration_counters`, `email_verification_tokens`, `password_reset_tokens`, `registration_status_history`, `audit_logs`.

Rules:
- Use UUID primary keys and foreign keys (`CHAR(36)`)
- Enforce registration-number uniqueness and valid status values in MySQL (`UNIQUE`, `ENUM`/`CHECK`)
- Use server-generated timestamps (`DEFAULT CURRENT_TIMESTAMP`)
- Use a transaction for related user/profile/registration writes
- Never store passwords in application tables as plain text; only a salted hash in `users.password_hash`
- Prevent duplicate registration for the same student and batch (`UNIQUE (student_id, batch_id)`) while allowing different courses

---

## 7. Non-Functional Requirements

### 7.1 Usability and Responsiveness
- Registration and sign-in steps must be clear
- Support mobile, tablet, and desktop screens

### 7.2 Availability and Reliability
- Website and database operate online independently of the developer's computer
- Errors must not produce false success messages or silently incomplete registrations
- Automated database backups with a documented restore process

### 7.3 Performance
- Common pages and queries respond in reasonable time under normal use (indexes on filter columns)

### 7.4 Maintainability and Data Integrity
- Organized JavaScript codebase and versioned SQL migrations
- Constraints and foreign keys protect consistency

---

## 8. Security Requirements

- All traffic over HTTPS
- Passwords hashed (bcrypt/argon2) and never stored raw or logged
- JWT in HTTP-only, Secure, SameSite cookies; short-lived access token
- Student endpoints always filter by the authenticated user's own `student_id` (ownership enforced in the service/model layer; this replaces PostgreSQL RLS)
- Only administrators may view all registrations, change statuses, or manage courses/batches; authorization verified on **every** sensitive server-side operation (hiding UI is not enough)
- All SQL uses parameterized queries; database account follows least privilege (no `DROP`/`GRANT` for the app user)
- Validate all input on the server; recheck batch/course availability at submission time
- Rate limiting / abuse protection on public registration, login, and password-reset endpoints
- Generic error messages for login/recovery to prevent account enumeration
- Secrets (DB credentials, JWT secret, email keys) only in environment variables, never in browser code
- Audit logs for status changes and course/batch edits
- Collect only information needed by LLC

---

## 9. Acceptance Criteria

- Students can create an account with email/password through the registration form
- Raw passwords are never stored
- Invalid submissions and closed-batch registrations are rejected clearly
- Successful registrations receive a unique number and `PENDING` status
- Students can log in and see only their own registrations
- Account recovery works through the configured secure process
- Administrators can search, filter, review, update, and export records
- Administrators can manage courses, batches, and registration availability
- Unauthorized users cannot access private records or admin functions
- The application and database stay online independently of the developer's computer

---

## 10. Assumptions and Decisions to Confirm

- LLC provides course names, descriptions, durations, schedules, and registration rules
- LLC identifies staff authorized to administer the system
- LLC decides whether email verification is required before dashboard access (recommended)
- LLC confirms mandatory personal fields (DOB, gender, address)
- Duplicate registration for the same batch is prevented unless LLC specifies otherwise
- Hosting provider is not yet chosen
- Batch capacity limits are not in the SRD; confirm whether LLC needs a seat limit
