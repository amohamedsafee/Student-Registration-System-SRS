const express = require('express');
const batchController = require('./batch.controller');

const router = express.Router();

// GET /api/batches/:id - Batch details and availability
router.get('/:id', batchController.getBatch);

module.exports = router;
