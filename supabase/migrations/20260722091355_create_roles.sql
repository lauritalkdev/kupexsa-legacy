-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Roles
-- ============================================================

CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.roles IS
'Defines application roles used for authorization.';

CREATE INDEX idx_roles_name
ON public.roles(name);

CREATE TRIGGER trg_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;