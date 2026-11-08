-- Anonymous aggregate actions only; retain existing funnel events.
ALTER TABLE public.premium_funnel_daily DROP CONSTRAINT premium_funnel_daily_event_check;
ALTER TABLE public.premium_funnel_daily ADD CONSTRAINT premium_funnel_daily_event_check
CHECK (event IN ('lock_open', 'parent_interest', 'offer_open', 'demo_complete', 'musaidi_suggestion', 'musaidi_correction', 'musaidi_twin', 'musaidi_revision'));
