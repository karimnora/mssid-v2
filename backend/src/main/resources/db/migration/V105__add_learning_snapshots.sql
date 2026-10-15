CREATE TABLE learning_snapshots (
 user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 owner_key VARCHAR(40) NOT NULL,
 child_id BIGINT REFERENCES child_profiles(id) ON DELETE CASCADE,
 scope VARCHAR(48) NOT NULL,
 results JSONB NOT NULL DEFAULT '{}',
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 PRIMARY KEY(user_id, owner_key, scope)
);
