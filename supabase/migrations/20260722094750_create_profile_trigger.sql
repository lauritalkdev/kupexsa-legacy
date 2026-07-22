-- ============================================================
-- KUPEXSA Connect
-- Migration: Create Profile Trigger
-- ============================================================


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS
$$
BEGIN

    INSERT INTO public.profiles
    (
        id,
        full_name,
        email,
        role_id,
        status
    )

    VALUES

    (
        NEW.id,

        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            'New Kupexsan'
        ),

        NEW.email,

        (
            SELECT id
            FROM public.roles
            WHERE name = 'Member'
            LIMIT 1
        ),

        'pending'
    );


    RETURN NEW;

END;
$$;



CREATE TRIGGER on_auth_user_created

AFTER INSERT ON auth.users

FOR EACH ROW

EXECUTE FUNCTION public.handle_new_user();