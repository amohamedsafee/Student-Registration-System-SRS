/**
 * Helper to format atomic registration numbers
 * Pattern: LLC-{year}-{counter padded to 6 digits}
 * Example: LLC-2026-000001
 */
function formatRegistrationNumber(year, counterValue) {
  const currentYear = year || new Date().getFullYear();
  const paddedValue = String(counterValue).padStart(6, '0');
  return `LLC-${currentYear}-${paddedValue}`;
}

/**
 * Validates registration number format
 * @param {string} regNumber 
 */
function isValidRegistrationNumber(regNumber) {
  if (typeof regNumber !== 'string') return false;
  return /^LLC-\d{4}-\d{6}$/.test(regNumber);
}

module.exports = {
  formatRegistrationNumber,
  isValidRegistrationNumber,
};
