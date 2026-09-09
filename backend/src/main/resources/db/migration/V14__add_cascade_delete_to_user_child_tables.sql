-- V14: add ON DELETE CASCADE to every table that references users(id), so account deletion is
-- safe by construction at the DB level instead of depending solely on UserService.deleteAccount()
-- deleting from each child table by hand before deleting the user row. That manual list still
-- works today, but silently goes stale the moment a new user-referencing table is added without
-- updating it, turning a routine feature addition into an account-deletion bug (a leftover FK
-- would make the DELETE fail with a constraint violation instead of cascading cleanly).

ALTER TABLE public.payment_receipts DROP CONSTRAINT fk5sa73914j72vskjxn5kvjpoc9;
ALTER TABLE public.payment_receipts
    ADD CONSTRAINT fk5sa73914j72vskjxn5kvjpoc9 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.subscriptions DROP CONSTRAINT fkhro52ohfqfbay9774bev0qinr;
ALTER TABLE public.subscriptions
    ADD CONSTRAINT fkhro52ohfqfbay9774bev0qinr FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.refresh_tokens DROP CONSTRAINT fk_refresh_tokens_user;
ALTER TABLE public.refresh_tokens
    ADD CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.email_verification_codes DROP CONSTRAINT fk_email_verification_codes_user;
ALTER TABLE public.email_verification_codes
    ADD CONSTRAINT fk_email_verification_codes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.password_reset_codes DROP CONSTRAINT fk_password_reset_codes_user;
ALTER TABLE public.password_reset_codes
    ADD CONSTRAINT fk_password_reset_codes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
