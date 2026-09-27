-- V100 (first V2 migration, see application-v2.properties): child profiles under a parent account.
-- Minimal data only (cahier des charges L-03): a first name or nickname, the grade, an optional
-- avatar. No birth date, no photo, no last name field.

CREATE TABLE public.child_profiles (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    display_name  VARCHAR(40) NOT NULL,
    grade         VARCHAR(16) NOT NULL,
    avatar        VARCHAR(16),
    created_at    TIMESTAMP NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_child_profiles_user_id ON public.child_profiles (user_id);
