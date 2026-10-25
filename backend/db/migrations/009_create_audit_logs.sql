-- Migration 009: Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id           CHAR(36)     NOT NULL DEFAULT (UUID()),
  user_id      CHAR(36)     NULL,
  action       VARCHAR(80)  NOT NULL,
  entity_type  VARCHAR(50)  NULL,
  entity_id    CHAR(36)     NULL,
  details      JSON         NULL,
  ip_address   VARCHAR(45)  NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_user (user_id),
  KEY idx_audit_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
