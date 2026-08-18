-- V9: minimal parental supervision — an optional parent/guardian email captured at registration.
-- Deliberately just a free-text nullable column, no verification flow: the product decision was
-- "frictionless, no blocking verification" (see the pre-launch audit's compliance findings). Lets an
-- admin reach a parent later (payment issue, moderation) without gating account creation on it.
ALTER TABLE public.users
    ADD COLUMN parent_email VARCHAR(255);
