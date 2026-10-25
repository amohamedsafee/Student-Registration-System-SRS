# Language Learning Campus (LLC) - Production Deployment & Operations Guide

## 1. Architecture Overview

The system runs as an independent **3-Tier Modular Monolith** operating 24/7 on an online cloud VPS (e.g. DigitalOcean, Hetzner, AWS, Linode), completely free of any dependency on the developer's local computer.

```
 Internet (HTTPS :443)
           │
           ▼
     ┌───────────┐
     │   Nginx   │ ── Serves static React Vite bundle (/var/www/llc-srs/frontend/dist)
     │ (SSL/TLS) │ ── Proxies API calls (/api/*) to localhost:5000
     └─────┬─────┘
           │ (HTTP :5000)
           ▼
     ┌───────────┐
     │  Node.js  │ ── PM2 Cluster Mode (autorestart, zero-downtime reloads)
     │  Express  │ ── Helmet, JWT cookies, rate limiters, transactional email
     └─────┬─────┘
           │ (TCP :3306)
           ▼
     ┌───────────┐
     │ MySQL 8.4 │ ── Least-privilege user (`llc_app_user` with CRUD only)
     │  InnoDB   │ ── Daily automated gzip backups with 7-day rotation
     └───────────┘
```

---

## 2. Server Provisioning Steps (Ubuntu 22.04 / 24.04 LTS)

### Step 2.1: System Updates & Dependencies
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server certbot python3-certbot-nginx
```

### Step 2.2: Install Node.js 20 LTS & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Step 2.3: Clone Codebase & Install Dependencies
```bash
sudo mkdir -p /var/www/llc-srs
sudo chown -R $USER:$USER /var/www/llc-srs
git clone <YOUR_GIT_REPO_URL> /var/www/llc-srs

# Backend install
cd /var/www/llc-srs/backend
npm ci --only=production

# Frontend build
cd /var/www/llc-srs/frontend
npm ci
npm run build
```

---

## 3. Least-Privilege Database Configuration

### Step 3.1: Run Database Migrations & Seeds
```bash
cd /var/www/llc-srs/backend
node db/migrate.js
node db/seed.js
```

### Step 3.2: Provision Runtime Least-Privilege User
Never run the application using MySQL `root`. Execute the pre-configured least-privilege script:
```bash
sudo mysql -u root < db/setup-least-privilege-user.sql
```
* **Runtime Privileges Granted:** `SELECT, INSERT, UPDATE, DELETE` on `llc_registration.*`.
* **Prohibited Privileges:** `DROP`, `GRANT`, `ALTER`, `CREATE`, `SUPER`, `FILE` (schema mutations can only be performed by the migration runner during deployment).

---

## 4. PM2 Process Manager Configuration

The application is orchestrated by PM2 using `backend/ecosystem.config.js`:

```bash
cd /var/www/llc-srs/backend

# Start cluster
pm2 start ecosystem.config.js --env production

# Save startup configuration to survive server reboots
pm2 save
pm2 startup
```

Useful operational commands:
```bash
pm2 status                     # View instance health and memory
pm2 logs llc-srs-backend       # Live streaming logs
pm2 reload llc-srs-backend     # Zero-downtime hot reload
pm2 restart llc-srs-backend    # Hard restart
```

---

## 5. Nginx & SSL/HTTPS Configuration

### Step 5.1: Install Configuration
```bash
sudo cp /var/www/llc-srs/deploy/nginx/nginx.conf /etc/nginx/sites-available/llc-srs
sudo ln -s /etc/nginx/sites-available/llc-srs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5.2: Provision Let's Encrypt Free SSL Certificate
```bash
sudo certbot --nginx -d srs.llc-edu.com
```

---

## 6. Alternative: 1-Command Docker Deployment

If deploying to a container host, the entire stack can be launched via Docker Compose:

```bash
# 1. Edit environment file
cp backend/.env.example .env

# 2. Launch production stack
docker compose up -d --build

# 3. View status
docker compose ps
docker compose logs -f
```

---

## 7. Automated Backups & Disaster Recovery

### Step 7.1: Automated Daily Cron Job
Install the automated backup script to run every night at 2:00 AM:
```bash
sudo chmod +x /var/www/llc-srs/backend/scripts/backup-database.sh
crontab -e
```
Add the following line:
```cron
0 2 * * * /var/www/llc-srs/backend/scripts/backup-database.sh >> /var/log/llc_backup.log 2>&1
```

### Step 7.2: Verifying and Testing a Backup Restore
To test disaster recovery in accordance with Day 26 requirements:
```bash
# Decompress and restore a backup into a test database or live database:
sudo chmod +x /var/www/llc-srs/backend/scripts/restore-database.sh
/var/www/llc-srs/backend/scripts/restore-database.sh /var/backups/llc-srs/llc_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## 8. Monitoring & Health Checks

### Step 8.1: Live Health Probe Endpoint
The backend exposes `GET /api/health` which executes a live `SELECT 1` database query:
```bash
curl http://localhost:5000/api/health
```
Sample Response (`200 OK`):
```json
{
  "status": "OK",
  "database": "CONNECTED",
  "uptimeSeconds": 86420,
  "timestamp": "2026-10-25T01:53:41.048Z",
  "environment": "production",
  "memory": { "rssMB": 74, "heapUsedMB": 13 }
}
```
*If MySQL becomes unreachable, the endpoint automatically returns `503 Service Unavailable`, triggering external alerts.*

### Step 8.2: External Uptime Monitoring
Configure a free external monitor (e.g. UptimeRobot, BetterStack, or Pingdom) to ping `https://srs.llc-edu.com/api/health` every 60 seconds with an HTTP 200 expectation.

---

## 9. Final Acceptance Criteria Walkthrough Matrix

| Requirement ID | Acceptance Criterion | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **FR-01** | Display LLC information, active courses, and open batches | Catalog API & Home/Courses page | **PASS** |
| **FR-02** | Combined account + registration intake in 1 atomic step | `POST /api/registrations/apply` | **PASS** |
| **FR-03** | Server validation: reject invalid inputs or closed batches | `tests/verify-all.js` (400 BATCH_CLOSED) | **PASS** |
| **FR-04** | Single MySQL transaction (`users`, `students`, `registrations`) | `database.withTransaction()` | **PASS** |
| **FR-05** | Rollback on any failure: zero partial records | Verified via transaction rollback tests | **PASS** |
| **FR-06** | Atomic sequential number generation (`LLC-2026-XXXXXX`) | Row lock on `registration_counters` | **PASS** |
| **FR-07** | Default registration status is `PENDING` | Verified in DB and confirmation screen | **PASS** |
| **FR-08** | Confirmation page with copyable registration reference | `frontend/src/pages/Register.jsx` | **PASS** |
| **FR-09** | Student auth: login, logout, password recovery | `/api/auth/*` & `Login.jsx` | **PASS** |
| **FR-10** | Student sees only own records; cross-student blocked | Ownership query + 404 test | **PASS** |
| **FR-11** | Admin authentication & protected route enforcement | `requireRole('admin')` & `AdminRoute.jsx` | **PASS** |
| **FR-12** | Admin stats dashboard (KPI cards, stage breakdown) | `/api/admin/stats` & `AdminDashboard.jsx` | **PASS** |
| **FR-13** | Search/filter registrations by name, reg #, phone, status | Indexed queries in `AdminRegistrations.jsx` | **PASS** |
| **FR-14** | Admin review details & status transitions with audit logs | Status modal, `registration_status_history`, `audit_logs` | **PASS** |
| **FR-15** | Admin manage courses & batches (open/close registration) | `AdminCourses.jsx` & `AdminBatches.jsx` | **PASS** |
| **FR-16** | Export registrations to CSV with formula injection defense | `=, +, -, @` escaping in `csvHelper.js` | **PASS** |
| **FR-17** | 5 allowed statuses: `PENDING`, `UNDER_REVIEW`, `CONFIRMED`, `REJECTED`, `CANCELLED` | MySQL `ENUM` constraint | **PASS** |
| **SEC-01** | Generic auth messages prevent user/email enumeration | Verified in `tests/security-review.test.js` | **PASS** |
| **SEC-02** | Passwords hashed with bcrypt (never logged or raw) | Verified in `users.password_hash` | **PASS** |
| **SEC-03** | Cookies use `HttpOnly`, `SameSite=Lax`, `Path=/` | Verified in test suite | **PASS** |
| **SEC-04** | Zero secrets in frontend build bundle | Verified via source and bundle audit | **PASS** |
| **SEC-05** | Least-privilege MySQL user & automated backup rotation | Scripted in `db/` and `scripts/` | **PASS** |
| **UI-01** | Strict Neo-Brutalist UI consistency with `sample.jsx` | Zero border-radius, hard shadows, brand tokens | **PASS** |
