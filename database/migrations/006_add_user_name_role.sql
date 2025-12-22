-- Migration: Add name and role to users table
-- Date: 2025-12-22

ALTER TABLE users
    ADD COLUMN name VARCHAR(100) NULL AFTER email,
    ADD COLUMN role ENUM('owner', 'editor', 'viewer') NOT NULL DEFAULT 'owner' AFTER password_hash;
