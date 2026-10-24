const crypto = require('crypto');

/**
 * Generate a cryptographically secure random token (hex)
 * @param {number} bytes 
 * @returns {string} raw token to send to the user via email
 */
function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Compute SHA-256 hash of a token for safe database storage
 * @param {string} token 
 * @returns {string} 64-char hex hash
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  generateRandomToken,
  hashToken,
};
