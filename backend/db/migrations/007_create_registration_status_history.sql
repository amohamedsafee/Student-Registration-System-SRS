-- Migration 007: Create registration_status_history table
CREATE TABLE IF NOT EXISTS registration_status_history (
  id               CHAR(36)     NOT NULL DEFAULT (UUID()),
  registration_id  CHAR(36)     NOT NULL,
  old_status       VARCHAR(20)  NULL,
  new_status       VARCHAR(20)  NOT NULL,
  changed_by       CHAR(36)     NULL,
  note             VARCHAR(255) NULL,
  changed_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hist_registration (registration_id),
  CONSTRAINT fk_hist_reg  FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE,
  CONSTRAINT fk_hist_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
