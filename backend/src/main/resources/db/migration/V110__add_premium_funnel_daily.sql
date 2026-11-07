-- Aggregate actions only. No account, child, cookie, IP or request identity is stored.
CREATE TABLE public.premium_funnel_daily (
    event varchar(32) NOT NULL,
    grade varchar(12) NOT NULL,
    day date NOT NULL,
    total bigint NOT NULL DEFAULT 0 CHECK (total >= 0),
    PRIMARY KEY (event, grade, day),
    CHECK (event IN ('lock_open', 'parent_interest', 'offer_open', 'demo_complete')),
    CHECK (grade IN ('1AP','2AP','3AP','4AP','5AP','unknown'))
);
