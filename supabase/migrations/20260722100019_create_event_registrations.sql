-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Event Registrations
-- ============================================================


CREATE TABLE public.event_registrations (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    event_id UUID NOT NULL
        REFERENCES public.events(id)
        ON DELETE CASCADE,


    member_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,


    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),


    UNIQUE(event_id, member_id)

);


COMMENT ON TABLE public.event_registrations IS
'Stores members registered for KUPEXSA events.';



CREATE INDEX idx_event_registrations_event
ON public.event_registrations(event_id);



CREATE INDEX idx_event_registrations_member
ON public.event_registrations(member_id);



ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;