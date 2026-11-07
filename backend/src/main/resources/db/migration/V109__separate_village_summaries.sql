-- A malformed legacy timestamp must never abort the migration.
CREATE OR REPLACE FUNCTION pg_temp.mssid_village_day(value text) RETURNS date AS $$
BEGIN
    RETURN (value::timestamptz AT TIME ZONE 'Africa/Algiers')::date;
EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Separate observations from scored history. Preserve remaining scored entries verbatim.

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS village_summaries jsonb NOT NULL DEFAULT '[]'::jsonb;
UPDATE public.users p SET village_summaries = COALESCE((
    SELECT jsonb_agg(value ORDER BY value->>'at') FROM (
        SELECT value FROM (
            SELECT DISTINCT ON (value->>'lessonId', pg_temp.mssid_village_day(value->>'at')) value
            FROM jsonb_array_elements(COALESCE(p.lesson_sessions, '[]'::jsonb)) value
            WHERE value ? 'villageSummary' AND pg_temp.mssid_village_day(value->>'at') IS NOT NULL
            ORDER BY value->>'lessonId', pg_temp.mssid_village_day(value->>'at'), value->>'at' DESC
        ) daily ORDER BY value->>'at' DESC LIMIT 6
    ) latest
), '[]'::jsonb);
UPDATE public.users p SET lesson_sessions = COALESCE((
    SELECT jsonb_agg(value ORDER BY ordinal) FROM jsonb_array_elements(COALESCE(p.lesson_sessions, '[]'::jsonb))
    WITH ORDINALITY AS entries(value, ordinal) WHERE NOT (value ? 'villageSummary')
), '[]'::jsonb);

ALTER TABLE public.child_profiles
    ADD COLUMN IF NOT EXISTS village_summaries jsonb NOT NULL DEFAULT '[]'::jsonb;
UPDATE public.child_profiles p SET village_summaries = COALESCE((
    SELECT jsonb_agg(value ORDER BY value->>'at') FROM (
        SELECT value FROM (
            SELECT DISTINCT ON (value->>'lessonId', pg_temp.mssid_village_day(value->>'at')) value
            FROM jsonb_array_elements(COALESCE(p.lesson_sessions, '[]'::jsonb)) value
            WHERE value ? 'villageSummary' AND pg_temp.mssid_village_day(value->>'at') IS NOT NULL
            ORDER BY value->>'lessonId', pg_temp.mssid_village_day(value->>'at'), value->>'at' DESC
        ) daily ORDER BY value->>'at' DESC LIMIT 6
    ) latest
), '[]'::jsonb);
UPDATE public.child_profiles p SET lesson_sessions = COALESCE((
    SELECT jsonb_agg(value ORDER BY ordinal) FROM jsonb_array_elements(COALESCE(p.lesson_sessions, '[]'::jsonb))
    WITH ORDINALITY AS entries(value, ordinal) WHERE NOT (value ? 'villageSummary')
), '[]'::jsonb);
