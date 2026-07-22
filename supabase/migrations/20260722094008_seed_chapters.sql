INSERT INTO public.chapters
(
    name,
    country_id,
    region,
    city,
    description
)

VALUES

(
    'Kumba Chapter',
    (SELECT id FROM public.countries WHERE code = 'CM'),
    'South West',
    'Kumba',
    'Home chapter of KUPEXSA'
),

(
    'Buea Chapter',
    (SELECT id FROM public.countries WHERE code = 'CM'),
    'South West',
    'Buea',
    'KUPEXSA chapter in Buea'
),

(
    'Douala Chapter',
    (SELECT id FROM public.countries WHERE code = 'CM'),
    'Littoral',
    'Douala',
    'KUPEXSA chapter in Douala'
),

(
    'Yaoundé Chapter',
    (SELECT id FROM public.countries WHERE code = 'CM'),
    'Centre',
    'Yaoundé',
    'KUPEXSA chapter in Yaoundé'
),

(
    'USA Chapter',
    (SELECT id FROM public.countries WHERE code = 'US'),
    NULL,
    NULL,
    'KUPEXSA international chapter in the United States'
),

(
    'UK Chapter',
    (SELECT id FROM public.countries WHERE code = 'GB'),
    NULL,
    NULL,
    'KUPEXSA international chapter in the United Kingdom'
);