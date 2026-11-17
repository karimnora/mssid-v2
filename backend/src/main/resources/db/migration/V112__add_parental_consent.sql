ALTER TABLE users
    ADD COLUMN parental_consent_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN parental_consent_version VARCHAR(80);
