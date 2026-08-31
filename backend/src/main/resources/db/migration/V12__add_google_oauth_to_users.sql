-- V12: adds Google Sign-In support. `google_id` links a user to their Google account's stable
-- subject id (the `sub` claim from the verified ID token) — kept separate from email so a later
-- email change on the Google side never breaks the link. `provider` just records how the account
-- was created (informational only: both flows issue the same session cookies afterwards).
-- Existing/local-password accounts default to 'LOCAL' and can still be linked to a Google account
-- later (google_id gets set, provider stays as-is) if the same, Google-verified email is used.
ALTER TABLE public.users
    ADD COLUMN provider VARCHAR(20) NOT NULL DEFAULT 'LOCAL',
    ADD COLUMN google_id VARCHAR(255);

ALTER TABLE public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);
