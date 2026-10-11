-- Uploaded receipts are image data URLs, which exceed the legacy 255-character URL limit.
-- Widen without discarding existing receipts.
ALTER TABLE public.payment_receipts ALTER COLUMN receipt_image_url TYPE TEXT;
