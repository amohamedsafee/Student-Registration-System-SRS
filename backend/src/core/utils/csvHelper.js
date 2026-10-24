/**
 * CSV generation utility with formula-injection protection
 */

/**
 * Escapes CSV field value and protects against CSV/Excel Formula Injection
 * (values starting with =, +, -, @ are escaped with a leading single quote)
 * @param {any} value 
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  let str = String(value);

  // Formula injection defense: escape leading dangerous characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  // Escape inner double quotes by doubling them
  str = str.replace(/"/g, '""');

  return `"${str}"`;
}

/**
 * Convert array of objects to CSV string
 * @param {Array<Object>} rows 
 * @param {Array<{ key: string, label: string }>} columns 
 * @returns {string}
 */
function generateCsv(rows, columns) {
  const headers = columns.map((col) => escapeCsvValue(col.label)).join(',');
  const lines = rows.map((row) =>
    columns.map((col) => escapeCsvValue(row[col.key])).join(',')
  );

  return [headers, ...lines].join('\r\n');
}

module.exports = {
  escapeCsvValue,
  generateCsv,
};
