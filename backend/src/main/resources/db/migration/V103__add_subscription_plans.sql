-- Preserve all existing subscriptions and legacy annual receipt prices/dates.
ALTER TABLE public.payment_receipts ADD COLUMN plan_id VARCHAR(24) NOT NULL DEFAULT 'LEGACY_12M';
ALTER TABLE public.payment_receipts ADD COLUMN duration_months INTEGER NOT NULL DEFAULT 12;
ALTER TABLE public.payment_receipts ADD CONSTRAINT receipt_duration_check CHECK (duration_months IN (3, 6, 12));
ALTER TABLE public.subscriptions ADD COLUMN plan_id VARCHAR(24);
ALTER TABLE public.subscriptions ADD COLUMN duration_months INTEGER;
