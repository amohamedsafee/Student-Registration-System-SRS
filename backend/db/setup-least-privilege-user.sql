-- ==============================================================================
-- Least-Privilege Database User Setup for LLC Student Registration System
-- Day 25 Security & Compliance Specification
-- ==============================================================================

-- 1. Create dedicated application user if it does not already exist
-- (Replace 'YourStrongProductionPassword2026!' with production vault secret)
CREATE USER IF NOT EXISTS 'llc_app_user'@'localhost' 
  IDENTIFIED BY 'YourStrongProductionPassword2026!';

CREATE USER IF NOT EXISTS 'llc_app_user'@'127.0.0.1' 
  IDENTIFIED BY 'YourStrongProductionPassword2026!';

-- 2. Revoke any potential administrative or schema-altering privileges
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'llc_app_user'@'localhost';
REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'llc_app_user'@'127.0.0.1';

-- 3. Grant strictly minimal CRUD privileges required for runtime operations
-- The application only requires SELECT, INSERT, UPDATE, DELETE on runtime tables.
-- DDL privileges (CREATE, ALTER, DROP, TRUNCATE, REFERENCES, INDEX) are restricted 
-- exclusively to migration scripts executed during deployment by the DBA.
GRANT SELECT, INSERT, UPDATE, DELETE ON llc_registration.* 
  TO 'llc_app_user'@'localhost';

GRANT SELECT, INSERT, UPDATE, DELETE ON llc_registration.* 
  TO 'llc_app_user'@'127.0.0.1';

-- 4. Apply changes
FLUSH PRIVILEGES;

-- 5. Verification query to inspect granted privileges
SHOW GRANTS FOR 'llc_app_user'@'localhost';
