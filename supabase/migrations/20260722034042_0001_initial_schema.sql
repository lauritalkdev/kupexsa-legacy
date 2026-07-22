-- ============================================================
-- KUPEXSA Connect
-- Migration: 0001_initial_schema
-- Purpose:
--   • Enable required PostgreSQL extensions
--   • Create reusable ENUM types
--   • Create reusable timestamp trigger function
-- ============================================================

---------------------------------------------------------------
-- Extensions
---------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

---------------------------------------------------------------
-- ENUMS
---------------------------------------------------------------

CREATE TYPE member_status AS ENUM (
    'pending',
    'verified',
    'suspended',
    'inactive'
);

CREATE TYPE gender AS ENUM (
    'male',
    'female',
    'prefer_not_to_say'
);

CREATE TYPE marital_status AS ENUM (
    'single',
    'married',
    'divorced',
    'widowed',
    'prefer_not_to_say'
);

CREATE TYPE event_type AS ENUM (
    'meeting',
    'agm',
    'reunion',
    'jubilee',
    'fundraising',
    'seminar',
    'other'
);

CREATE TYPE attendance_status AS ENUM (
    'checked_in',
    'checked_out',
    'absent'
);

---------------------------------------------------------------
-- COMMON UPDATED_AT FUNCTION
---------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;