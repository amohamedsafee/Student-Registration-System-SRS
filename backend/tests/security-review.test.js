const http = require('http');
const app = require('../src/app');
const db = require('../src/config/database');
const { escapeCsvValue } = require('../src/core/utils/csvHelper');

async function runSecurityAudit() {
  console.log('====================================================');
  console.log('🛡️  DAY 23: COMPREHENSIVE SECURITY & AUDIT SUITE');
  console.log('====================================================\n');

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  async function request(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const fetchOptions = {
      method: options.method || 'GET',
      headers,
    };
    if (options.body) {
      fetchOptions.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
    }

    const res = await fetch(url, fetchOptions);
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { status: res.status, headers: res.headers, data };
  }

  try {
    // -------------------------------------------------------------
    // 1. Generic Auth Errors (Anti-Enumeration)
    // -------------------------------------------------------------
    console.log('--- 1. Anti-Enumeration & Generic Auth Errors ---');

    // Wrong email
    const badEmailRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'nonexistent@example.com', password: 'SomePassword123!' },
    });
    assert(badEmailRes.status === 401, 'Non-existent email returns 401 Unauthorized');
    assert(badEmailRes.data.error?.message === 'Invalid email or password', 'Generic error message for unknown email');

    // Correct email, wrong password
    const badPassRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@llc.edu.lk', password: 'WrongPassword999!' },
    });
    assert(badPassRes.status === 401, 'Wrong password returns 401 Unauthorized');
    assert(badPassRes.data.error?.message === 'Invalid email or password', 'Identical generic message for wrong password (prevents email probing)');

    // Forgot password with non-existent email
    const forgotNonExistentRes = await request('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: 'unknown.user.999@example.com' },
    });
    assert(forgotNonExistentRes.status === 200, 'Forgot password returns 200 even for unknown email');
    assert(
      forgotNonExistentRes.data.message.includes('If an account exists'),
      'Forgot password returns generic message regardless of email existence'
    );

    // -------------------------------------------------------------
    // 2. Cookie Security Flags
    // -------------------------------------------------------------
    console.log('\n--- 2. Cookie Security Flags ---');
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@llc.edu.lk', password: 'AdminPass2026!' },
    });
    assert(loginRes.status === 200, 'Admin login succeeded');
    const setCookie = loginRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('HttpOnly'), 'Auth cookie has HttpOnly flag set (XSS defense)');
    assert(setCookie && setCookie.includes('Path=/'), 'Auth cookie scoped to root Path=/');
    assert(setCookie && setCookie.includes('SameSite=Lax'), 'Auth cookie has SameSite=Lax (CSRF mitigation)');

    const adminCookieHeader = { Cookie: setCookie };

    // -------------------------------------------------------------
    // 3. Security HTTP Headers (Helmet)
    // -------------------------------------------------------------
    console.log('\n--- 3. HTTP Security Headers (Helmet) ---');
    const healthRes = await request('/api/health');
    assert(healthRes.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options: nosniff header present');
    assert(healthRes.headers.get('x-frame-options') === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN header present (Clickjacking defense)');
    assert(!healthRes.headers.get('x-powered-by'), 'X-Powered-By header is suppressed (no tech stack leakage)');

    // -------------------------------------------------------------
    // 4. SQL Injection Resistance
    // -------------------------------------------------------------
    console.log('\n--- 4. SQL Injection Attacks Resistance ---');

    // SQL injection payload in search filter
    const sqlPayloads = [
      "' OR '1'='1",
      "'; DROP TABLE users; --",
      "1' UNION SELECT null, null, null, null, null, null, null, null, null, null--",
    ];

    for (const payload of sqlPayloads) {
      const sqliRes = await request(`/api/admin/registrations?search=${encodeURIComponent(payload)}`, {
        headers: adminCookieHeader,
      });
      assert(
        sqliRes.status === 200 && Array.isArray(sqliRes.data?.data),
        `Query with SQLi payload [${payload}] handled safely without SQL syntax error or injection`
      );
    }

    // -------------------------------------------------------------
    // 5. Formula Injection Resistance (CSV Export)
    // -------------------------------------------------------------
    console.log('\n--- 5. CSV Formula Injection Defense ---');
    assert(escapeCsvValue('=cmd|calc!A0') === `"'=cmd|calc!A0"`, 'Equals sign (=) formula escaped with leading quote');
    assert(escapeCsvValue('+12345') === ` "'+12345" `.trim(), 'Plus sign (+) formula escaped with leading quote');
    assert(escapeCsvValue('-5+5') === ` "'-5+5" `.trim(), 'Minus sign (-) formula escaped with leading quote');
    assert(escapeCsvValue('@SUM(A1:A10)') === `"'@SUM(A1:A10)"`, 'At sign (@) formula escaped with leading quote');

    // -------------------------------------------------------------
    // 6. Strict Role-Based Access Control (RBAC)
    // -------------------------------------------------------------
    console.log('\n--- 6. Role-Based Access Control Enforcement ---');
    // Anonymous user rejected from admin endpoints
    const unauthRes = await request('/api/admin/stats');
    assert(unauthRes.status === 401, 'Anonymous request to /api/admin/stats rejected with 401 Unauthorized');

    // Student rejected from admin endpoints
    // Create a temporary student
    const studentEmail = `student.sec.${Date.now()}@example.com`;
    const openBatches = await db.query('SELECT id FROM batches WHERE is_registration_open = TRUE LIMIT 1');
    const studentApplyRes = await request('/api/registrations/apply', {
      method: 'POST',
      body: {
        full_name: 'Security Test Student',
        email: studentEmail,
        password: 'Password123!',
        phone_number: '0779991122',
        batch_id: openBatches[0].id,
      },
    });
    assert(studentApplyRes.status === 201, 'Test student registered');

    // Student logs in
    const studentLogin = await request('/api/auth/login', {
      method: 'POST',
      body: { email: studentEmail, password: 'Password123!' },
    });
    const studentCookie = studentLogin.headers.get('set-cookie');
    const studentCookieHeader = { Cookie: studentCookie };

    // Student attempts admin access
    const studentAdminRes = await request('/api/admin/courses', { headers: studentCookieHeader });
    assert(studentAdminRes.status === 403, 'Student access to /api/admin/courses rejected with 403 Forbidden');

    const studentBatchRes = await request('/api/admin/batches', { headers: studentCookieHeader });
    assert(studentBatchRes.status === 403, 'Student access to /api/admin/batches rejected with 403 Forbidden');

    const studentExportRes = await request('/api/admin/registrations/export', { headers: studentCookieHeader });
    assert(studentExportRes.status === 403, 'Student access to /api/admin/registrations/export rejected with 403 Forbidden');

    console.log('\n====================================================');
    console.log(`🎉 SECURITY SUITE: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal security audit error:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

runSecurityAudit();
