-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Chapters
-- ============================================================

CREATE TABLE public.chapters (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    name TEXT NOT NULL,

    country_id UUID NOT NULL
        REFERENCES public.countries(id)
        ON DELETE RESTRICT,

    region TEXT,

    city TEXT,

    description TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_chapter_location
    UNIQUE(name, country_id)

);


COMMENT ON TABLE public.chapters IS
'Stores KUPEXSA chapters around the world.';


CREATE INDEX idx_chapters_country
ON public.chapters(country_id);


CREATE INDEX idx_chapters_name
ON public.chapters(name);


CREATE TRIGGER trg_chapters_updated_at
BEFORE UPDATE ON public.chapters
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;