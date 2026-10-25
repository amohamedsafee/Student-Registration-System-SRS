const adminService = require('./admin.service');

class AdminController {
  /* ---------------- Courses ---------------- */

  async getCourses(req, res, next) {
    try {
      const courses = await adminService.getAllCourses();
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }

  async createCourse(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const course = await adminService.createCourse(req.body, req.user.id, clientIp);
      res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
    } catch (error) {
      next(error);
    }
  }

  async updateCourse(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const course = await adminService.updateCourse(req.params.id, req.body, req.user.id, clientIp);
      res.json({ success: true, message: 'Course updated successfully.', data: course });
    } catch (error) {
      next(error);
    }
  }

  async setCourseActive(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const { is_active } = req.body;
      const course = await adminService.setCourseActive(req.params.id, is_active, req.user.id, clientIp);
      res.json({ success: true, message: 'Course status updated successfully.', data: course });
    } catch (error) {
      next(error);
    }
  }

  /* ---------------- Batches ---------------- */

  async getBatches(req, res, next) {
    try {
      const batches = await adminService.getAllBatches();
      res.json({ success: true, data: batches });
    } catch (error) {
      next(error);
    }
  }

  async createBatch(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const batch = await adminService.createBatch(req.body, req.user.id, clientIp);
      res.status(201).json({ success: true, message: 'Batch created successfully.', data: batch });
    } catch (error) {
      next(error);
    }
  }

  async updateBatch(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const batch = await adminService.updateBatch(req.params.id, req.body, req.user.id, clientIp);
      res.json({ success: true, message: 'Batch updated successfully.', data: batch });
    } catch (error) {
      next(error);
    }
  }

  async setBatchRegistrationOpen(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const { is_registration_open } = req.body;
      const batch = await adminService.setBatchRegistrationOpen(req.params.id, is_registration_open, req.user.id, clientIp);
      res.json({ success: true, message: 'Batch registration status updated.', data: batch });
    } catch (error) {
      next(error);
    }
  }

  /* ---------------- Registrations Review ---------------- */

  async getRegistrations(req, res, next) {
    try {
      const result = await adminService.getRegistrations({
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        status: req.query.status,
        courseId: req.query.course_id,
        batchId: req.query.batch_id,
        dateFrom: req.query.date_from,
        dateTo: req.query.date_to,
      });
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRegistrationDetails(req, res, next) {
    try {
      const registration = await adminService.getRegistrationDetails(req.params.id);
      res.json({ success: true, data: registration });
    } catch (error) {
      next(error);
    }
  }

  async updateRegistrationStatus(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const { status, note } = req.body;
      const result = await adminService.updateRegistrationStatus({
        registrationId: req.params.id,
        newStatus: status,
        adminId: req.user.id,
        note,
        clientIp,
      });
      res.json({
        success: true,
        message: `Registration status updated to ${status}.`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /* ---------------- Stats & Export ---------------- */

  async getStats(req, res, next) {
    try {
      const stats = await adminService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async exportRegistrationsCsv(req, res, next) {
    try {
      const clientIp = req.ip || req.connection.remoteAddress;
      const csvData = await adminService.exportRegistrationsCsv(
        {
          status: req.query.status,
          courseId: req.query.course_id,
          batchId: req.query.batch_id,
          dateFrom: req.query.date_from,
          dateTo: req.query.date_to,
        },
        req.user.id,
        clientIp
      );

      const dateStr = new Date().toISOString().split('T')[0];
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="llc-registrations-${dateStr}.csv"`);
      res.status(200).send(csvData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
