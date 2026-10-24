/**
 * Validation helper for public registration
 */
function validateRegistrationApply(data = {}) {
  const errors = {};

  // Full name
  if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.trim().length < 3) {
    errors.full_name = 'Full name is required (minimum 3 characters).';
  } else if (data.full_name.trim().length > 150) {
    errors.full_name = 'Full name must not exceed 150 characters.';
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string' || !emailRegex.test(data.email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  // Password
  if (!data.password || typeof data.password !== 'string' || data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long.';
  }

  // Phone number (Sri Lankan formats: 07XXXXXXXX, +947XXXXXXXX, etc.)
  const phoneRegex = /^(?:(?:\+|00)94|0)?7[0-9]{8}$/;
  if (!data.phone_number || typeof data.phone_number !== 'string' || !phoneRegex.test(data.phone_number.replace(/[\s-]/g, ''))) {
    errors.phone_number = 'A valid Sri Lankan mobile number is required (e.g., 0771234567).';
  }

  // Batch ID
  if (!data.batch_id || typeof data.batch_id !== 'string' || data.batch_id.trim().length === 0) {
    errors.batch_id = 'Please select a course batch.';
  }

  // Date of birth (optional)
  if (data.date_of_birth) {
    const dob = new Date(data.date_of_birth);
    if (isNaN(dob.getTime())) {
      errors.date_of_birth = 'Invalid date of birth format.';
    } else if (dob > new Date()) {
      errors.date_of_birth = 'Date of birth cannot be in the future.';
    }
  }

  // Gender (optional)
  if (data.gender && !['male', 'female', 'other'].includes(data.gender.toLowerCase())) {
    errors.gender = 'Gender must be male, female, or other.';
  }

  return { errors };
}

module.exports = {
  validateRegistrationApply,
};
