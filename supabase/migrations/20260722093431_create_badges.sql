-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Badges
-- ============================================================

CREATE TABLE public.badges (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    badge_year INTEGER NOT NULL UNIQUE,

    entry_year INTEGER NOT NULL,

    graduation_year INTEGER NOT NULL,

    display_name TEXT NOT NULL UNIQUE,

    description TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);


COMMENT ON TABLE public.badges IS
'Stores PHS Kumba alumni badge/cohort information.';


CREATE INDEX idx_badges_year
ON public.badges(badge_year);


CREATE TRIGGER trg_badges_updated_at
BEFORE UPDATE ON public.badges
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;