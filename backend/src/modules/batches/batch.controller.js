const batchService = require('./batch.service');

class BatchController {
  /**
   * GET /api/batches/:id
   */
  async getBatch(req, res, next) {
    try {
      const { id } = req.params;
      const batch = await batchService.getBatchById(id);
      res.json({ batch });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BatchController();
