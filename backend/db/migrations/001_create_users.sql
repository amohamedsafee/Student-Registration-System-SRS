-- Migration 001: Create users table
CREATE TABLE IF NOT EXISTS users (
  id                CHAR(36)     NOT NULL DEFAULT (UUID()),
  email             VARCHAR(255) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,
  role              ENUM('student', 'admin') NOT NULL DEFAULT 'student',
  email_verified_at DATETIME     NULL,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login_at     DATETIME     NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
