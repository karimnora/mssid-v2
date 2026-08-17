-- V5: "Didou Studio" cosmetic economy (gold coins + unlocked/equipped outfits) — previously tracked
-- only in the frontend's localStorage, lost on any device change or cleared cache while xp/level
-- already round-tripped through the backend. Brings the same durability to this data.

ALTER TABLE public.users
    ADD COLUMN gold_coins integer NOT NULL DEFAULT 150;

ALTER TABLE public.users
    ADD COLUMN avatar_config jsonb;
