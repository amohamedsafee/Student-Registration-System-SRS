-- Migration 003: Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  name         VARCHAR(150) NOT NULL,
  description  TEXT         NULL,
  duration     VARCHAR(60)  NULL,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
