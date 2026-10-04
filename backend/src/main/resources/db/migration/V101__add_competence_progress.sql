-- V101 (V2): competence notebook + lesson sessions, per account and per child profile.

ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS competence_stats jsonb NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS lesson_sessions jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.child_profiles
    ADD COLUMN IF NOT EXISTS competence_stats jsonb NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS lesson_sessions jsonb NOT NULL DEFAULT '[]'::jsonb;
