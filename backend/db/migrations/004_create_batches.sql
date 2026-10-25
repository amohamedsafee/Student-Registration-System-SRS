-- Migration 004: Create batches table
CREATE TABLE IF NOT EXISTS batches (
  id                    CHAR(36)     NOT NULL DEFAULT (UUID()),
  course_id             CHAR(36)     NOT NULL,
  batch_name            VARCHAR(100) NOT NULL,
  start_date            DATE         NOT NULL,
  schedule              VARCHAR(200) NULL,
  is_registration_open  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_batches_course_name (course_id, batch_name),
  KEY idx_batches_open (is_registration_open, start_date),
  CONSTRAINT fk_batches_course FOREIGN KEY (course_id)
    REFERENCES courses(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
