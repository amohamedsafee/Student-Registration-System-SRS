const express = require('express');
const courseController = require('./course.controller');

const router = express.Router();

// GET /api/courses - List active courses
router.get('/', courseController.listCourses);

// GET /api/courses/:id - Course details
router.get('/:id', courseController.getCourse);

// GET /api/courses/:id/batches - Open batches for a course
router.get('/:id/batches', courseController.getCourseBatches);

module.exports = router;
