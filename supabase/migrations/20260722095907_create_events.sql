-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Events
-- ============================================================


CREATE TABLE public.events (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    title TEXT NOT NULL,

    description TEXT,

    event_type event_type NOT NULL DEFAULT 'meeting',

    venue TEXT,

    city TEXT,

    start_date TIMESTAMPTZ NOT NULL,

    end_date TIMESTAMPTZ,

    banner_image TEXT,

    registration_required BOOLEAN NOT NULL DEFAULT TRUE,

    is_published BOOLEAN NOT NULL DEFAULT FALSE,


    created_by UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,


    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

);


COMMENT ON TABLE public.events IS
'Stores KUPEXSA meetings, reunions, AGMs, and special events.';



CREATE INDEX idx_events_date
ON public.events(start_date);


CREATE INDEX idx_events_type
ON public.events(event_type);



CREATE TRIGGER trg_events_updated_at

BEFORE UPDATE ON public.events

FOR EACH ROW

EXECUTE FUNCTION update_updated_at_column();



ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;