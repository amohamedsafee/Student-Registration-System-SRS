#!/bin/bash
# ==============================================================================
# Automated Database Backup Script for LLC Student Registration System
# Day 25 & 26 Requirement: Daily Automated Backups with Rotation
# ==============================================================================

set -euo pipefail

# Configuration
DB_NAME="${DB_NAME:-llc_registration}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASSWORD:-}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/llc-srs}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/llc_backup_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting automated database backup for '${DB_NAME}'..."

# Execute consistent atomic dump with compression
if [ -n "${DB_PASS}" ]; then
  mysqldump -u "${DB_USER}" -p"${DB_PASS}" \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    "${DB_NAME}" | gzip > "${BACKUP_FILE}"
else
  mysqldump -u "${DB_USER}" \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    "${DB_NAME}" | gzip > "${BACKUP_FILE}"
fi

# Verify backup file size is greater than 1KB
FILESIZE=$(stat -c%s "${BACKUP_FILE}" 2>/dev/null || stat -f%z "${BACKUP_FILE}" 2>/dev/null || echo 0)
if [ "${FILESIZE}" -gt 1024 ]; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup created successfully: ${BACKUP_FILE} (${FILESIZE} bytes)"
else
  echo "[ERROR] Backup file appears empty or corrupt! Check database logs." >&2
  exit 1
fi

# Prune archives older than retention threshold
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Removing backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "llc_backup_*.sql.gz" -mtime +"${RETENTION_DAYS}" -delete

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Database backup maintenance completed."
