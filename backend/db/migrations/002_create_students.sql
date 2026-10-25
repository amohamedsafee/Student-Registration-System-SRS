-- Migration 002: Create students table
CREATE TABLE IF NOT EXISTS students (
  id               CHAR(36)     NOT NULL DEFAULT (UUID()),
  auth_user_id     CHAR(36)     NOT NULL,
  full_name        VARCHAR(150) NOT NULL,
  date_of_birth    DATE         NULL,
  gender           VARCHAR(20)  NULL,
  phone_number     VARCHAR(30)  NOT NULL,
  whatsapp_number  VARCHAR(30)  NULL,
  home_address     VARCHAR(255) NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_auth_user (auth_user_id),
  KEY idx_students_phone (phone_number),
  KEY idx_students_name (full_name),
  CONSTRAINT fk_students_user FOREIGN KEY (auth_user_id)
    REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
