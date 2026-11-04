-- Weekly parent report by e-mail (V2): the parent can stop it with one click, and a send is
-- recorded so that a restart or a second instance never e-mails the same family twice a week.
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_report_opt_out BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS weekly_report_last_sent_at TIMESTAMP NULL;
