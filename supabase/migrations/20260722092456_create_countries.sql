-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Countries
-- ============================================================

CREATE TABLE public.countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE,

    code TEXT NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.countries IS
'Stores countries where Kupexsans reside.';

CREATE INDEX idx_countries_name
ON public.countries(name);

CREATE TRIGGER trg_countries_updated_at
BEFORE UPDATE ON public.countries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;