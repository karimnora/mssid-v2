-- Activation codes (كود التفعيل): prepaid cards sold in bookshops, codes sent after a BaridiMob
-- payment, and school licences (one code for a whole class). Only a SHA-256 hash of each code is
-- stored; the plain codes are shown once to the admin who generates them.
CREATE TABLE IF NOT EXISTS activation_codes (
    id BIGSERIAL PRIMARY KEY,
    code_hash VARCHAR(64) NOT NULL UNIQUE,
    code_hint VARCHAR(8) NOT NULL,
    kind VARCHAR(16) NOT NULL,
    plan_id VARCHAR(16) NOT NULL,
    duration_months INT NOT NULL,
    max_uses INT NOT NULL DEFAULT 1,
    used_count INT NOT NULL DEFAULT 0,
    batch_label VARCHAR(120) NOT NULL,
    valid_until DATE NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_activation_codes_batch ON activation_codes (batch_label);

CREATE TABLE IF NOT EXISTS activation_code_redemptions (
    id BIGSERIAL PRIMARY KEY,
    code_id BIGINT NOT NULL REFERENCES activation_codes(id),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_activation_code_user UNIQUE (code_id, user_id)
);
