-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Profiles
-- ============================================================


CREATE SEQUENCE member_id_sequence
START 1;


CREATE OR REPLACE FUNCTION generate_member_id()
RETURNS TEXT
LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN 'KPX' ||
    LPAD(nextval('member_id_sequence')::TEXT, 6, '0');
END;
$$;



CREATE TABLE public.profiles (

    id UUID PRIMARY KEY
        REFERENCES auth.users(id)
        ON DELETE CASCADE,


    member_id TEXT NOT NULL
        UNIQUE
        DEFAULT generate_member_id(),


    full_name TEXT NOT NULL,

    preferred_name TEXT,


    gender gender,


    date_of_birth DATE,


    phone TEXT,

    whatsapp TEXT,


    email TEXT,


    entry_year INTEGER,

    graduation_year INTEGER,


    badge_id UUID
        REFERENCES public.badges(id)
        ON DELETE SET NULL,


    country_id UUID
        REFERENCES public.countries(id)
        ON DELETE SET NULL,


    chapter_id UUID
        REFERENCES public.chapters(id)
        ON DELETE SET NULL,


    occupation_id UUID
        REFERENCES public.occupations(id)
        ON DELETE SET NULL,


    company TEXT,


    marital_status marital_status,


    biography TEXT,


    profile_photo TEXT,


    role_id UUID NOT NULL
        REFERENCES public.roles(id)
        ON DELETE RESTRICT,


    status member_status
        NOT NULL
        DEFAULT 'pending',


    created_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW(),


    updated_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()

);



COMMENT ON TABLE public.profiles IS
'Stores KUPEXSA member identities and alumni information.';



CREATE INDEX idx_profiles_member_id
ON public.profiles(member_id);


CREATE INDEX idx_profiles_name
ON public.profiles(full_name);


CREATE INDEX idx_profiles_badge
ON public.profiles(badge_id);


CREATE INDEX idx_profiles_chapter
ON public.profiles(chapter_id);



CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();



ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;