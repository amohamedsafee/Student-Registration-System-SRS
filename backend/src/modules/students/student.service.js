const studentModel = require('./student.model');
const { NotFoundError, BadRequestError } = require('../../core/errors/AppError');

class StudentService {
  /**
   * Get student profile for current auth user
   */
  async getProfile(authUserId) {
    const student = await studentModel.findByAuthUserId(authUserId);
    if (!student) {
      throw new NotFoundError('Student profile not found.');
    }
    return student;
  }

  /**
   * Update student profile
   */
  async updateProfile(authUserId, updateData) {
    const student = await studentModel.findByAuthUserId(authUserId);
    if (!student) {
      throw new NotFoundError('Student profile not found.');
    }

    if (updateData.phone_number) {
      const phoneRegex = /^(?:(?:\+|00)94|0)?7[0-9]{8}$/;
      if (!phoneRegex.test(updateData.phone_number.replace(/[\s-]/g, ''))) {
        throw new BadRequestError('A valid Sri Lankan mobile number is required (e.g., 0771234567).');
      }
    }

    return await studentModel.updateProfile(student.student_id, {
      fullName: updateData.full_name,
      dateOfBirth: updateData.date_of_birth,
      gender: updateData.gender,
      phoneNumber: updateData.phone_number,
      whatsappNumber: updateData.whatsapp_number,
      homeAddress: updateData.home_address,
    });
  }
}

module.exports = new StudentService();
