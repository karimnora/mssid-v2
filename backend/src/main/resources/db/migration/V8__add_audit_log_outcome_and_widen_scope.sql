-- Broadens admin_audit_logs from "admin-triggered actions only" to a general system event log
-- (email sends, registration/login failures, receipt submissions, AI tutor failures) so failures
-- that previously only existed as an ephemeral console log.error become queryable by an admin.
-- Every existing row represents a completed successful admin action, so DEFAULT 'SUCCESS' backfills
-- correctly with no data loss.
ALTER TABLE admin_audit_logs ADD COLUMN outcome VARCHAR(20) NOT NULL DEFAULT 'SUCCESS';

CREATE INDEX idx_admin_audit_logs_action_type ON admin_audit_logs (action_type);
CREATE INDEX idx_admin_audit_logs_outcome ON admin_audit_logs (outcome);
CREATE INDEX idx_admin_audit_logs_actor_email ON admin_audit_logs (actor_email);
