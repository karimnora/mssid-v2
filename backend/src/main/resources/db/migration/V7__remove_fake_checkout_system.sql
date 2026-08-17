-- V7: product decision — the "checkout" system (payment_transactions, createCheckout, the webhook
-- endpoint) never had a real payment-gateway integration behind it: createCheckout fabricated a
-- pay.chargily.com URL as a plain string, and the "webhook" trusted a caller-supplied status field
-- with no signature verification (already admin-only-gated as a stopgap, see PaymentController's
-- prior SEC-04 comment). It was also unreachable in practice: PricingModal, its only frontend
-- consumer, had no live trigger anywhere in the app. The real, working payment flow is the manual
-- receipt-upload + admin-review path (payment_receipts), which this migration leaves untouched.

DROP TABLE IF EXISTS public.payment_transactions;
