const express = require('express');
const studentController = require('./student.controller');
const requireAuth = require('../../core/middlewares/requireAuth');
const requireRole = require('../../core/middlewares/requireRole');

const router = express.Router();

router.use(requireAuth);
router.use(requireRole('student'));

router.get('/me', studentController.getMe);
router.put('/me', studentController.updateMe);

module.exports = router;
