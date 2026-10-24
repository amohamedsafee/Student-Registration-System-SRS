# LLC Student Registration System: API Plan

## 1. Overview
The system exposes a RESTful API built with **Node.js and Express.js** (JavaScript). It serves the React frontend (public pages, student dashboard, admin dashboard). All endpoints accept and return `application/json`, except the CSV export (`text/csv`).

Base path: `/api`

## 2. Authentication & Authorization
Uses email/password with bcrypt/argon2 hashing; the server issues a JWT in an **HTTP-only, Secure, SameSite** cookie. Roles: `student`, `admin`.

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticate user and set cookie | Public |
| `/api/auth/logout` | `POST` | Clear auth cookie | Authenticated |
| `/api/auth/me` | `GET` | Current user and role | Authenticated |
| `/api/auth/verify-email` | `POST` | Verify email with token | Public |
| `/api/auth/resend-verification` | `POST` | Resend verification email | Authenticated |
| `/api/auth/forgot-password` | `POST` | Request password reset email (always generic response) | Public |
| `/api/auth/reset-password` | `POST` | Set new password using reset token | Public |

*Note: Student accounts are created through the registration endpoint (section 4), not a separate signup endpoint.*

## 3. Course & Batch Discovery

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/courses` | `GET` | List active courses | Public |
| `/api/courses/{id}` | `GET` | Course details | Public |
| `/api/courses/{id}/batches` | `GET` | Open batches for a course | Public |
| `/api/batches/{id}` | `GET` | Batch details and availability | Public |

## 4. Registration Engine (Transactional)
Critical endpoint: runs inside a single MySQL transaction (user + student + registration + number generation).

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/registrations/apply` | `POST` | Create account, profile, and `PENDING` registration; returns registration number | Public (rate limited) |
| `/api/registrations` | `POST` | Add another registration (different course/batch) for the logged-in student | Student |
| `/api/registrations/me` | `GET` | List the student's own registrations and statuses | Student |
| `/api/registrations/me/{id}` | `GET` | One of the student's own registrations | Student (owner) |
| `/api/registrations/me/{id}/cancel` | `POST` | Student requests cancellation of a pending registration | Student (owner) |
| `/api/students/me` | `GET` / `PUT` | View / update own profile | Student |

**Sample request: `POST /api/registrations/apply`**

```json
{
  "full_name": "A. Fathima",
  "date_of_birth": "2005-04-12",
  "gender": "female",
  "phone_number": "0771234567",
  "whatsapp_number": "0771234567",
  "email": "fathima@example.com",
  "password": "********",
  "home_address": "Kalmunai",
  "batch_id": "uuid-of-batch"
}
```

**Sample response (`201 Created`)**

```json
{
  "registration_number": "LLC-2026-000001",
  "status": "PENDING",
  "message": "Registration submitted. Please verify your email."
}
```

## 5. Admin: Registration Review

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/admin/registrations` | `GET` | List with search/filter/pagination: `name`, `registration_number`, `phone`, `course_id`, `batch_id`, `date_from`, `date_to`, `status` | Admin |
| `/api/admin/registrations/{id}` | `GET` | Full registration + student details + status history | Admin |
| `/api/admin/registrations/{id}/status` | `PATCH` | Update status (`PENDING`, `UNDER_REVIEW`, `CONFIRMED`, `REJECTED`, `CANCELLED`); writes history and audit log | Admin |
| `/api/admin/registrations/export` | `GET` | CSV export honoring the same filters | Admin |
| `/api/admin/stats` | `GET` | Dashboard metrics: totals by status, by course, by batch, registrations today | Admin |

## 6. Admin: Course & Batch Management

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/admin/courses` | `GET` / `POST` | List all courses / create course | Admin |
| `/api/admin/courses/{id}` | `PUT` | Edit course | Admin |
| `/api/admin/courses/{id}/active` | `PATCH` | Activate / deactivate course | Admin |
| `/api/admin/batches` | `GET` / `POST` | List all batches / create batch | Admin |
| `/api/admin/batches/{id}` | `PUT` | Edit batch | Admin |
| `/api/admin/batches/{id}/registration-open` | `PATCH` | Open / close registration for a batch | Admin |

## 7. Validation Rules (Server-Side)
- Email format and uniqueness; password minimum length and strength
- Phone number format (Sri Lankan formats accepted)
- `batch_id` must exist, its course must be active, and `is_registration_open` must be true at submission time
- Optional fields (DOB, gender, address, WhatsApp) validated only when LLC marks them required
- Status updates restricted to the five allowed values
- Reject unexpected fields (whitelist)

## 8. Error Handling & Status Codes
*   **200 OK**: Request succeeded.
*   **201 Created**: Registration or resource created.
*   **400 Bad Request**: Validation failed (invalid fields, closed batch).
*   **401 Unauthorized**: Missing or invalid session.
*   **403 Forbidden**: Insufficient permission (e.g., student calling admin routes) or unverified email where required.
*   **404 Not Found**: Resource missing (also returned for another student's record to avoid leaking existence).
*   **409 Conflict**: Duplicate email or duplicate registration for the same batch.
*   **429 Too Many Requests**: Rate limit exceeded.
*   **500 Internal Server Error**: Unexpected failure (transaction rolled back; never reported as success).

Standard error body:

```json
{ "error": { "code": "BATCH_CLOSED", "message": "Registration for this batch is closed." } }
```
