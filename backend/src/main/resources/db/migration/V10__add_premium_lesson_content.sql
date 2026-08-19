-- T2/T3 server-side content gate (pilot) — see trimesterAccess.ts's own doc comment: lesson content
-- was statically bundled into the frontend JS for every visitor regardless of role, making the T2/T3
-- paywall a pure UX nudge with no real content protection. This table holds the full pedagogical
-- content for T2/T3 lessons that have been migrated off the static bundle; the frontend keeps only a
-- free "shell" (catalog metadata) for these lessons and fetches the rest through an authenticated,
-- role-checked endpoint (see PremiumContentController).
CREATE TABLE public.premium_lesson_content (
    lesson_id VARCHAR(255) PRIMARY KEY,
    grade VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    trimester INT NOT NULL,
    content_json TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
