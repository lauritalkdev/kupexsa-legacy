-- ============================================================
-- KUPEXSA Connect
-- Migration: RLS Policies
-- ============================================================


---------------------------------------------------------------
-- PROFILES
---------------------------------------------------------------


CREATE POLICY "Members can view own profile"

ON public.profiles

FOR SELECT

USING (
    auth.uid() = id
);



CREATE POLICY "Members can update own profile"

ON public.profiles

FOR UPDATE

USING (
    auth.uid() = id
);



CREATE POLICY "Verified members can view verified profiles"

ON public.profiles

FOR SELECT

USING (
    status = 'verified'
);



---------------------------------------------------------------
-- LOOKUP TABLES
---------------------------------------------------------------


CREATE POLICY "Anyone can view countries"

ON public.countries

FOR SELECT

USING (true);



CREATE POLICY "Anyone can view occupations"

ON public.occupations

FOR SELECT

USING (true);



CREATE POLICY "Anyone can view badges"

ON public.badges

FOR SELECT

USING (true);



CREATE POLICY "Anyone can view chapters"

ON public.chapters

FOR SELECT

USING (true);



CREATE POLICY "Anyone can view roles"

ON public.roles

FOR SELECT

USING (true);