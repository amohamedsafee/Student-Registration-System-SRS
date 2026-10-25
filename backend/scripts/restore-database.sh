#!/bin/bash
# ==============================================================================
# Database Restore Verification Script for LLC Student Registration System
# Day 26 Requirement: Backup Restore Testing
# ==============================================================================

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 /path/to/llc_backup_YYYYMMDD_HHMMSS.sql.gz"
  exit 1
fi

BACKUP_FILE="$1"
DB_NAME="${DB_NAME:-llc_registration}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASSWORD:-}"

if [ ! -f "${BACKUP_FILE}" ]; then
  echo "[ERROR] Backup file not found: ${BACKUP_FILE}" >&2
  exit 1
fi

echo "⚠️  WARNING: This will overwrite data in database '${DB_NAME}'!"
read -p "Type 'RESTORE' to proceed: " CONFIRM

if [ "${CONFIRM}" != "RESTORE" ]; then
  echo "Restore aborted by user."
  exit 0
fi

echo "Restoring database from ${BACKUP_FILE}..."

if [ -n "${DB_PASS}" ]; then
  gunzip < "${BACKUP_FILE}" | mysql -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}"
else
  gunzip < "${BACKUP_FILE}" | mysql -u "${DB_USER}" "${DB_NAME}"
fi

echo "✅ Database restored successfully!"
