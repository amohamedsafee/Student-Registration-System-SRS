const express = require('express');
const adminController = require('./admin.controller');
const requireAuth = require('../../core/middlewares/requireAuth');
const requireRole = require('../../core/middlewares/requireRole');

const router = express.Router();

// Strict security perimeter: reject unauthenticated (401) and non-admin (403)
router.use(requireAuth);
router.use(requireRole('admin'));

/* ---------------- Course Routes ---------------- */
router.get('/courses', adminController.getCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.patch('/courses/:id/active', adminController.setCourseActive);

/* ---------------- Batch Routes ---------------- */
router.get('/batches', adminController.getBatches);
router.post('/batches', adminController.createBatch);
router.put('/batches/:id', adminController.updateBatch);
router.patch('/batches/:id/registration-open', adminController.setBatchRegistrationOpen);

/* ---------------- Registration Review Routes ---------------- */
router.get('/registrations', adminController.getRegistrations);
router.get('/registrations/export', adminController.exportRegistrationsCsv);
router.get('/registrations/:id', adminController.getRegistrationDetails);
router.patch('/registrations/:id/status', adminController.updateRegistrationStatus);

/* ---------------- Stats Route ---------------- */
router.get('/stats', adminController.getStats);

module.exports = router;
