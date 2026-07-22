-- ============================================================
-- KUPEXSA Connect
-- Migration: Events & Attendance RLS
-- ============================================================


---------------------------------------------------------------
-- EVENTS
---------------------------------------------------------------


CREATE POLICY "Anyone can view published events"

ON public.events

FOR SELECT

USING (
    is_published = true
);



CREATE POLICY "Admins can create events"

ON public.events

FOR INSERT

WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.profiles
        JOIN public.roles
        ON profiles.role_id = roles.id
        WHERE profiles.id = auth.uid()
        AND roles.name IN (
            'Super Admin',
            'Executive Admin',
            'Chapter Admin'
        )
    )
);



CREATE POLICY "Admins can update events"

ON public.events

FOR UPDATE

USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        JOIN public.roles
        ON profiles.role_id = roles.id
        WHERE profiles.id = auth.uid()
        AND roles.name IN (
            'Super Admin',
            'Executive Admin',
            'Chapter Admin'
        )
    )
);



---------------------------------------------------------------
-- EVENT REGISTRATION
---------------------------------------------------------------


CREATE POLICY "Members can register themselves"

ON public.event_registrations

FOR INSERT

WITH CHECK (
    member_id = auth.uid()
);



CREATE POLICY "Members view own registrations"

ON public.event_registrations

FOR SELECT

USING (
    member_id = auth.uid()
);



---------------------------------------------------------------
-- ATTENDANCE
---------------------------------------------------------------


CREATE POLICY "Members view own attendance"

ON public.attendance

FOR SELECT

USING (
    member_id = auth.uid()
);



CREATE POLICY "Admins manage attendance"

ON public.attendance

FOR ALL

USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        JOIN public.roles
        ON profiles.role_id = roles.id
        WHERE profiles.id = auth.uid()
        AND roles.name IN (
            'Super Admin',
            'Executive Admin',
            'Chapter Admin'
        )
    )
);