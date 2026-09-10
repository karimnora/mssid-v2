-- V15: "Reels CMS Studio" — admin-only ad/reel factory (AI-generated educational social content,
-- edited then exported to PNG/MP4 for manual posting to TikTok/Instagram/Facebook). Slides/tags are
-- opaque JSONB, same pattern as users.avatar_config: the shape is defined and interpreted entirely
-- by the frontend (see frontend/src/types/reels.ts), never validated server-side.

CREATE TABLE public.ad_reels (
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    description       TEXT,
    grade_level       VARCHAR(16) NOT NULL,
    category          VARCHAR(32) NOT NULL,
    tags              JSONB NOT NULL DEFAULT '[]'::jsonb,
    slides            JSONB NOT NULL DEFAULT '[]'::jsonb,
    status            VARCHAR(16) NOT NULL DEFAULT 'draft',
    is_ai_generated   BOOLEAN NOT NULL DEFAULT true,
    created_by_email  VARCHAR(255),
    created_at        TIMESTAMP NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_ad_reels_updated_at ON public.ad_reels (updated_at DESC);
