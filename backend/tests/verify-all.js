const http = require('http');
const db = require('../src/config/database');
const app = require('../src/app');

// Start test server on random port
async function runTests() {
  console.log('====================================================');
  console.log('🧪 LLC SYSTEM INTEGRATED TEST SUITE (DAYS 11 - 22)');
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

  // HTTP Helper
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
    return {
      status: res.status,
      headers: res.headers,
      data,
    };
  }

  try {
    // 1. Fetch an open batch from database
    const openBatches = await db.query(
      'SELECT b.id, b.batch_name, b.course_id, c.name as course_name FROM batches b JOIN courses c ON b.course_id = c.id WHERE b.is_registration_open = TRUE LIMIT 2'
    );
    assert(openBatches.length > 0, 'Found open batch for registration tests');
    const targetBatch1 = openBatches[0];
    const targetBatch2 = openBatches[1] || openBatches[0];

    // -------------------------------------------------------------------
    // DAY 11 & 12: Direct Intake Registration (Public)
    // -------------------------------------------------------------------
    console.log('\n--- DAY 11 & 12: Public Registration Transaction ---');
    const testEmail1 = `student.test.${Date.now()}@example.com`;
    const regPayload1 = {
      full_name: 'Fathima Nuha',
      email: testEmail1,
      password: 'SecurePassword2026!',
      phone_number: '0771234567',
      whatsapp_number: '0771234567',
      date_of_birth: '2004-05-15',
      gender: 'female',
      home_address: 'Main Street, Kalmunai',
      batch_id: targetBatch1.id,
    };

    const regRes1 = await request('/api/registrations/apply', {
      method: 'POST',
      body: regPayload1,
    });

    assert(regRes1.status === 201, `Registration created (status 201), got ${regRes1.status}`);
    assert(regRes1.data.success === true, 'Response contains success: true');
    assert(/^LLC-\d{4}-\d{6}$/.test(regRes1.data.data.registration_number), `Generated valid registration number: ${regRes1.data.data?.registration_number}`);
    assert(regRes1.data.data.status === 'PENDING', 'Initial registration status is PENDING');

    const regNumber1 = regRes1.data.data.registration_number;

    // -------------------------------------------------------------------
    // DAY 13: Failure & Integrity Testing
    // -------------------------------------------------------------------
    console.log('\n--- DAY 13: Failure & Edge-Case Testing ---');

    // Test A: Duplicate Email Rejection
    const dupEmailRes = await request('/api/registrations/apply', {
      method: 'POST',
      body: {
        ...regPayload1,
        full_name: 'Imposter Student',
      },
    });
    assert(dupEmailRes.status === 409, `Duplicate email rejected with 409 Conflict (got ${dupEmailRes.status})`);

    // Test B: Closed Batch Rejection
    // Create or find a closed batch
    const closedBatches = await db.query('SELECT id FROM batches WHERE is_registration_open = FALSE LIMIT 1');
    let closedBatchId = closedBatches[0]?.id;
    if (!closedBatchId) {
      // Temporarily mark a dummy batch closed
      await db.query(
        'INSERT INTO batches (id, course_id, batch_name, start_date, is_registration_open) VALUES (UUID(), ?, "Closed Batch Test", "2026-06-01", FALSE)',
        [targetBatch1.course_id]
      );
      const bRows = await db.query('SELECT id FROM batches WHERE batch_name = "Closed Batch Test"');
      closedBatchId = bRows[0].id;
    }

    const closedRes = await request('/api/registrations/apply', {
      method: 'POST',
      body: {
        full_name: 'Late Student',
        email: `late.${Date.now()}@example.com`,
        password: 'Password123!',
        phone_number: '0779998877',
        batch_id: closedBatchId,
      },
    });
    assert(closedRes.status === 400, `Closed batch rejected with 400 Bad Request (got ${closedRes.status})`);

    // Test C: Concurrent Number Generation
    console.log('  Testing 5 concurrent registrations for unique sequential numbers...');
    const concurrentEmails = Array.from({ length: 5 }, (_, i) => `concurrent.${Date.now()}.${i}@example.com`);
    const concurrentPromises = concurrentEmails.map((email, idx) =>
      request('/api/registrations/apply', {
        method: 'POST',
        body: {
          full_name: `Concurrent Student ${idx}`,
          email,
          password: 'Password123!',
          phone_number: `077111222${idx}`,
          batch_id: targetBatch1.id,
        },
      })
    );
    const concurrentResults = await Promise.all(concurrentPromises);
    const generatedNumbers = concurrentResults.map((r) => r.data?.data?.registration_number).filter(Boolean);
    const uniqueNumbers = new Set(generatedNumbers);
    assert(uniqueNumbers.size === 5, `All 5 concurrent registrations received distinct numbers: ${[...uniqueNumbers].join(', ')}`);

    // -------------------------------------------------------------------
    // DAY 14: Student Authentication & Dashboard Endpoints
    // -------------------------------------------------------------------
    console.log('\n--- DAY 14: Student Authentication & Dashboard Endpoints ---');

    // Log in as test student 1
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail1,
        password: 'SecurePassword2026!',
      },
    });
    assert(loginRes.status === 200, `Student login succeeded (status 200)`);
    const studentCookie = loginRes.headers.get('set-cookie');
    const studentAuthHeader = { Cookie: studentCookie };

    // Student self profile
    const profileRes = await request('/api/students/me', { headers: studentAuthHeader });
    assert(profileRes.status === 200, `GET /api/students/me returns 200`);
    assert(profileRes.data.data.full_name === 'Fathima Nuha', `Profile matches registered name`);

    // Update profile
    const updateProfileRes = await request('/api/students/me', {
      method: 'PUT',
      headers: studentAuthHeader,
      body: {
        full_name: 'Fathima Nuha Updated',
        whatsapp_number: '0779876543',
      },
    });
    assert(updateProfileRes.status === 200, `PUT /api/students/me updated successfully`);
    assert(updateProfileRes.data.data.full_name === 'Fathima Nuha Updated', `Profile name updated`);

    // Student registrations list
    const myRegsRes = await request('/api/registrations/me', { headers: studentAuthHeader });
    assert(myRegsRes.status === 200, `GET /api/registrations/me returns 200`);
    assert(myRegsRes.data.data.length >= 1, `Student sees their registrations (count: ${myRegsRes.data.data.length})`);
    const studentRegId1 = myRegsRes.data.data[0].id;

    // View specific registration
    const mySingleRegRes = await request(`/api/registrations/me/${studentRegId1}`, { headers: studentAuthHeader });
    assert(mySingleRegRes.status === 200, `GET /api/registrations/me/:id returns 200`);
    assert(mySingleRegRes.data.data.registration_number === regNumber1, `Registration details match number ${regNumber1}`);

    // Additional course registration
    if (targetBatch2.id !== targetBatch1.id) {
      const addRegRes = await request('/api/registrations', {
        method: 'POST',
        headers: studentAuthHeader,
        body: { batch_id: targetBatch2.id },
      });
      assert(addRegRes.status === 201, `Student enrolled in additional batch (status 201)`);
    }

    // Duplicate batch enrollment rejection
    const dupBatchRes = await request('/api/registrations', {
      method: 'POST',
      headers: studentAuthHeader,
      body: { batch_id: targetBatch1.id },
    });
    assert(dupBatchRes.status === 409, `Duplicate batch enrollment rejected with 409 Conflict`);

    // Student cancellation of pending registration
    const cancelRes = await request(`/api/registrations/me/${studentRegId1}/cancel`, {
      method: 'POST',
      headers: studentAuthHeader,
      body: { reason: 'Schedule conflict with my university classes' },
    });
    assert(cancelRes.status === 200, `Student cancelled pending registration successfully (status 200)`);
    assert(cancelRes.data.data.status === 'CANCELLED', `Registration status is now CANCELLED`);

    // -------------------------------------------------------------------
    // DAY 15: Cross-Student Privacy & Boundary Checks
    // -------------------------------------------------------------------
    console.log('\n--- DAY 15: Cross-Student Privacy Boundary Check ---');

    // Create Student B
    const testEmail2 = `student.b.${Date.now()}@example.com`;
    const regResB = await request('/api/registrations/apply', {
      method: 'POST',
      body: {
        full_name: 'Student B',
        email: testEmail2,
        password: 'PasswordB2026!',
        phone_number: '0773334444',
        batch_id: targetBatch1.id,
      },
    });
    const regIdB = (await db.query('SELECT id FROM registrations WHERE registration_number = ?', [regResB.data.data.registration_number]))[0].id;

    // Student A tries to view Student B's registration -> Must return 404 (zero information leakage)
    const unauthorizedViewRes = await request(`/api/registrations/me/${regIdB}`, { headers: studentAuthHeader });
    assert(unauthorizedViewRes.status === 404, `Student A querying Student B's registration returns 404 Not Found (got ${unauthorizedViewRes.status})`);

    // Student A tries to cancel Student B's registration -> Must return 404
    const unauthorizedCancelRes = await request(`/api/registrations/me/${regIdB}/cancel`, {
      method: 'POST',
      headers: studentAuthHeader,
    });
    assert(unauthorizedCancelRes.status === 404, `Student A attempting to cancel Student B's registration returns 404 Not Found`);

    // -------------------------------------------------------------------
    // DAY 16: Admin Authentication & Course/Batch API
    // -------------------------------------------------------------------
    console.log('\n--- DAY 16: Admin Authentication & Catalog Management ---');

    // Log in as seeded Admin
    const adminLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@llc.edu.lk',
        password: 'AdminPass2026!',
      },
    });
    assert(adminLoginRes.status === 200, `Admin logged in successfully (status 200)`);
    const adminCookie = adminLoginRes.headers.get('set-cookie');
    const adminAuthHeader = { Cookie: adminCookie };

    // Create course
    const newCourseRes = await request('/api/admin/courses', {
      method: 'POST',
      headers: adminAuthHeader,
      body: {
        name: `Japanese for Beginners ${Date.now()}`,
        description: 'Introductory Japanese N5 level',
        duration: '4 Months',
        is_active: true,
      },
    });
    assert(newCourseRes.status === 201, `Admin created course (status 201)`);
    const createdCourseId = newCourseRes.data.data.id;

    // Toggle course active
    const deactCourseRes = await request(`/api/admin/courses/${createdCourseId}/active`, {
      method: 'PATCH',
      headers: adminAuthHeader,
      body: { is_active: false },
    });
    assert(deactCourseRes.status === 200 && deactCourseRes.data.data.is_active === 0, `Admin deactivated course`);

    // Create batch under course
    const newBatchRes = await request('/api/admin/batches', {
      method: 'POST',
      headers: adminAuthHeader,
      body: {
        course_id: createdCourseId,
        batch_name: 'Batch 01 - Weekend',
        start_date: '2026-07-01',
        schedule: 'Saturdays 9AM-1PM',
        is_registration_open: true,
      },
    });
    assert(newBatchRes.status === 201, `Admin created batch (status 201)`);
    const createdBatchId = newBatchRes.data.data.id;

    // Toggle batch registration open
    const closeBatchRes = await request(`/api/admin/batches/${createdBatchId}/registration-open`, {
      method: 'PATCH',
      headers: adminAuthHeader,
      body: { is_registration_open: false },
    });
    assert(closeBatchRes.status === 200 && closeBatchRes.data.data.is_registration_open === 0, `Admin closed batch registration`);

    // -------------------------------------------------------------------
    // DAY 18: Admin Registration Review API
    // -------------------------------------------------------------------
    console.log('\n--- DAY 18: Admin Registration Review API ---');

    const adminRegsRes = await request('/api/admin/registrations?limit=10&page=1', { headers: adminAuthHeader });
    assert(adminRegsRes.status === 200, `Admin listed registrations (status 200)`);
    assert(adminRegsRes.data.pagination.total >= 1, `Registrations total count is ${adminRegsRes.data.pagination.total}`);
    assert(Array.isArray(adminRegsRes.data.data), 'Returns data array');

    // Search filter
    const searchRes = await request(`/api/admin/registrations?search=Nuha`, { headers: adminAuthHeader });
    assert(searchRes.status === 200 && searchRes.data.data.length >= 1, `Search by student name returned matching records`);

    // Registration detail endpoint
    const regDetailRes = await request(`/api/admin/registrations/${regIdB}`, { headers: adminAuthHeader });
    assert(regDetailRes.status === 200, `Admin fetched registration detail with full history`);
    assert(Array.isArray(regDetailRes.data.data.history), `Registration detail includes status history array`);

    // -------------------------------------------------------------------
    // DAY 20: Admin Status Update & Audit Logging
    // -------------------------------------------------------------------
    console.log('\n--- DAY 20: Admin Status Updates & History ---');

    const statusUpdateRes = await request(`/api/admin/registrations/${regIdB}/status`, {
      method: 'PATCH',
      headers: adminAuthHeader,
      body: {
        status: 'CONFIRMED',
        note: 'Payment received at LLC admissions office.',
      },
    });
    assert(statusUpdateRes.status === 200, `Admin updated status to CONFIRMED (status 200)`);
    assert(statusUpdateRes.data.data.newStatus === 'CONFIRMED', `New status is CONFIRMED`);

    // Verify audit log row was written
    const [auditRow] = await db.query(
      'SELECT action, entity_id FROM audit_logs WHERE entity_id = ? ORDER BY created_at DESC LIMIT 1',
      [regIdB]
    );
    assert(auditRow?.action === 'REGISTRATION_STATUS_UPDATE', `Audit log recorded: REGISTRATION_STATUS_UPDATE`);

    // -------------------------------------------------------------------
    // DAY 21: Stats & Safe CSV Export
    // -------------------------------------------------------------------
    console.log('\n--- DAY 21: Stats & CSV Export Protection ---');

    const statsRes = await request('/api/admin/stats', { headers: adminAuthHeader });
    assert(statsRes.status === 200, `Admin stats endpoint returned 200`);
    assert(typeof statsRes.data.data.total === 'number', `Stats total is a number (${statsRes.data.data.total})`);
    assert(statsRes.data.data.byStatus.CONFIRMED >= 1, `Confirmed count reflected in stats`);

    // CSV Export
    const csvRes = await request('/api/admin/registrations/export', { headers: adminAuthHeader });
    assert(csvRes.status === 200, `CSV export returned 200`);
    assert(csvRes.headers.get('content-type').includes('text/csv'), `Content-Type is text/csv`);
    assert(typeof csvRes.data === 'string' && csvRes.data.includes('Registration Number'), `CSV output contains headers`);

    // Formula injection check:
    // If a student full name or address starts with '=2+2', csvHelper must prefix it with a single quote "'"
    const formulaEscaped = require('../src/core/utils/csvHelper').escapeCsvValue('=SUM(A1:A10)');
    assert(formulaEscaped === `"'=SUM(A1:A10)"`, `Formula injection defense: escaped formula with leading quote: ${formulaEscaped}`);

    // -------------------------------------------------------------------
    // DAY 22: Security Boundary Check (Role enforcement)
    // -------------------------------------------------------------------
    console.log('\n--- DAY 22: Security Verification on All Admin Routes ---');

    // 1. Unauthenticated access to admin routes -> 401
    const unauthCourseRes = await request('/api/admin/courses');
    assert(unauthCourseRes.status === 401, `Anonymous GET /api/admin/courses rejected with 401`);

    const unauthRegsRes = await request('/api/admin/registrations');
    assert(unauthRegsRes.status === 401, `Anonymous GET /api/admin/registrations rejected with 401`);

    const unauthStatsRes = await request('/api/admin/stats');
    assert(unauthStatsRes.status === 401, `Anonymous GET /api/admin/stats rejected with 401`);

    // 2. Student access to admin routes -> 403 Forbidden
    const studentCourseRes = await request('/api/admin/courses', { headers: studentAuthHeader });
    assert(studentCourseRes.status === 403, `Student GET /api/admin/courses rejected with 403 Forbidden`);

    const studentRegsRes = await request('/api/admin/registrations', { headers: studentAuthHeader });
    assert(studentRegsRes.status === 403, `Student GET /api/admin/registrations rejected with 403 Forbidden`);

    const studentStatsRes = await request('/api/admin/stats', { headers: studentAuthHeader });
    assert(studentStatsRes.status === 403, `Student GET /api/admin/stats rejected with 403 Forbidden`);

    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Fatal test error:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

runTests();
