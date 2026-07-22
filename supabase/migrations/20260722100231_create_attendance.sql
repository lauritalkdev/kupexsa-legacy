-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Attendance
-- ============================================================


CREATE TABLE public.attendance (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),


    event_id UUID NOT NULL
        REFERENCES public.events(id)
        ON DELETE CASCADE,


    member_id UUID NOT NULL
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,


    status attendance_status NOT NULL DEFAULT 'checked_in',


    check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),


    check_out_time TIMESTAMPTZ,


    verification_method TEXT
        DEFAULT 'manual',


    verified_by UUID
        REFERENCES public.profiles(id)
        ON DELETE SET NULL,


    notes TEXT,


    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),


    UNIQUE(event_id, member_id)

);


COMMENT ON TABLE public.attendance IS
'Stores actual KUPEXSA event attendance records.';



CREATE INDEX idx_attendance_event
ON public.attendance(event_id);



CREATE INDEX idx_attendance_member
ON public.attendance(member_id);



CREATE INDEX idx_attendance_time
ON public.attendance(check_in_time);



ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;