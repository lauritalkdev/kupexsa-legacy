DO $$

DECLARE

    year_value INTEGER;

BEGIN

    FOR year_value IN 1963..2022 LOOP

        INSERT INTO public.badges
        (
            badge_year,
            entry_year,
            graduation_year,
            display_name
        )

        VALUES

        (
            year_value,
            year_value,
            year_value + 5,
            'Badge ' || year_value
        );

    END LOOP;

END $$;