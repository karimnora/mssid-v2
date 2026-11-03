-- « مساعدي »: detailed corrections opened per family account and per Algerian calendar day.
-- Free accounts get 3 per day; the server is the authority so a reinstall cannot reset it.
CREATE TABLE musaidi_openings (
 user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 day DATE NOT NULL,
 item_id VARCHAR(200) NOT NULL,
 opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(user_id, day, item_id)
);
