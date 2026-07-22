-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Occupations
-- ============================================================

CREATE TABLE public.occupations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);


COMMENT ON TABLE public.occupations IS
'Stores standardized professions and occupations of Kupexsans.';


CREATE INDEX idx_occupations_name
ON public.occupations(name);


CREATE TRIGGER trg_occupations_updated_at
BEFORE UPDATE ON public.occupations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


ALTER TABLE public.occupations ENABLE ROW LEVEL SECURITY;