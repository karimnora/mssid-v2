-- Only new V2 cahiers consume credits. Existing V1 printables stay free.
CREATE TABLE public.family_cahier_unlocks (
    user_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    document_id VARCHAR(120) NOT NULL,
    week_start DATE NOT NULL,
    PRIMARY KEY (user_id, document_id)
);
CREATE INDEX idx_family_cahier_week ON public.family_cahier_unlocks(user_id, week_start);
