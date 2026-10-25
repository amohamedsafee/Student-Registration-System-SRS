-- Migration 006: Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id                   CHAR(36)    NOT NULL DEFAULT (UUID()),
  registration_number  VARCHAR(20) NOT NULL,
  student_id           CHAR(36)    NOT NULL,
  batch_id             CHAR(36)    NOT NULL,
  registration_date    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status               ENUM('PENDING','UNDER_REVIEW','CONFIRMED','REJECTED','CANCELLED')
                       NOT NULL DEFAULT 'PENDING',
  created_at           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_registrations_number (registration_number),
  UNIQUE KEY uq_registrations_student_batch (student_id, batch_id),
  KEY idx_registrations_status (status),
  KEY idx_registrations_date (registration_date),
  KEY idx_registrations_batch (batch_id),
  CONSTRAINT fk_reg_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reg_batch   FOREIGN KEY (batch_id)   REFERENCES batches(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
