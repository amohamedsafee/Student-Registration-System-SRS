-- Migration 005: Create registration_counters table
CREATE TABLE IF NOT EXISTS registration_counters (
  year        SMALLINT NOT NULL,
  last_value  INT      NOT NULL DEFAULT 0,
  PRIMARY KEY (year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
