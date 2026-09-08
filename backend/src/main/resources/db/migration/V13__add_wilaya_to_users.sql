-- V13: adds an optional wilaya (Algerian province) field to user accounts, collected at registration
-- (or later, via the profile/settings screen) — needed for B2B partner reporting (regional breakdown).
-- Free-text, same pattern as V9's parent_email: nullable, no FK/enum, so existing rows and the 58
-- current wilaya names both stay valid without any backfill.
ALTER TABLE public.users
    ADD COLUMN wilaya VARCHAR(255);
