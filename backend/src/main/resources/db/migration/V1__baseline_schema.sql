-- V1: baseline schema, captured from the live dev database (13 tables) that Hibernate's
-- ddl-auto=update had been maintaining. Generated via:
--   docker exec mssid-postgres pg_dump -U postgres -d mssid_db --schema-only --no-owner --no-privileges
-- Flyway takes over schema ownership from here on (see application.properties:
-- spring.jpa.hibernate.ddl-auto is now 'validate', not 'update').

--
-- PostgreSQL database dump
--


-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)



--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_audit_logs (
    id bigint NOT NULL,
    action_type character varying(255) NOT NULL,
    actor_email character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    details text,
    target_id character varying(255),
    target_type character varying(255) NOT NULL
);


--
-- Name: admin_audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_audit_logs_id_seq OWNED BY public.admin_audit_logs.id;


--
-- Name: cms_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_courses (
    id character varying(255) NOT NULL,
    attachments jsonb,
    author_name character varying(255),
    body_html_content text,
    chapter_id character varying(255),
    created_at character varying(255),
    grade character varying(255),
    interactive_tool character varying(255),
    key_formulas jsonb,
    media_urls jsonb,
    reviewer_name character varying(255),
    rules_ar jsonb,
    subject character varying(255),
    summary_ar text,
    title_ar text,
    title_fr text,
    updated_at character varying(255),
    version integer,
    versions_history jsonb,
    workflow_status character varying(255)
);


--
-- Name: cms_curriculum; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_curriculum (
    id character varying(255) NOT NULL,
    academic_year character varying(255),
    chapters jsonb,
    country character varying(255),
    grade character varying(255),
    school_system character varying(255),
    subject character varying(255),
    updated_at character varying(255)
);


--
-- Name: cms_exams; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_exams (
    id character varying(255) NOT NULL,
    author_name character varying(255),
    auto_grading_enabled boolean,
    created_at character varying(255),
    duration_minutes integer,
    exercise_ids jsonb,
    grade character varying(255),
    passing_score integer,
    session_ar text,
    subject character varying(255),
    title_ar text,
    total_points integer,
    updated_at character varying(255),
    workflow_status character varying(255),
    year integer
);


--
-- Name: cms_exercises; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cms_exercises (
    id character varying(255) NOT NULL,
    chapter_id character varying(255),
    competency_code character varying(255),
    correct_solution_ar text,
    course_id character varying(255),
    difficulty character varying(255),
    estimated_minutes integer,
    fill_blanks_text_ar text,
    grade character varying(255),
    matching_pairs jsonb,
    options jsonb,
    points_xp integer,
    question_ar text,
    step_by_step_explanation_ar text,
    subject character varying(255),
    title_ar text,
    type character varying(255),
    updated_at character varying(255),
    workflow_status character varying(255)
);


--
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_messages (
    id bigint NOT NULL,
    email character varying(255) NOT NULL,
    message text NOT NULL,
    name character varying(255) NOT NULL,
    submitted_at timestamp(6) without time zone,
    type character varying(255) NOT NULL
);


--
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- Name: exam_papers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.exam_papers (
    annee integer NOT NULL,
    trimestre integer,
    created_at timestamp(6) without time zone,
    id bigint NOT NULL,
    correction_bareme_details text,
    matiere character varying(255) NOT NULL,
    niveau character varying(255) NOT NULL,
    pdf_solution_url character varying(255),
    pdf_subject_url character varying(255) NOT NULL,
    titre character varying(255) NOT NULL
);


--
-- Name: exam_papers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.exam_papers ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.exam_papers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: feature_flags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feature_flags (
    id bigint NOT NULL,
    enabled boolean NOT NULL,
    flag_key character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    updated_by_email character varying(255)
);


--
-- Name: feature_flags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.feature_flags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: feature_flags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.feature_flags_id_seq OWNED BY public.feature_flags.id;


--
-- Name: payment_receipts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_receipts (
    amount_dzd double precision,
    id bigint NOT NULL,
    submitted_at timestamp(6) without time zone,
    user_id bigint NOT NULL,
    verified_at timestamp(6) without time zone,
    payment_method character varying(255),
    receipt_image_url character varying(255) NOT NULL,
    rejection_reason character varying(255),
    status character varying(255) NOT NULL,
    transaction_ref character varying(255),
    CONSTRAINT payment_receipts_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING_VERIFICATION'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: payment_receipts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.payment_receipts ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.payment_receipts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: payment_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_transactions (
    id bigint NOT NULL,
    amount_dzd double precision,
    checkout_id character varying(255) NOT NULL,
    checkout_url character varying(255),
    created_at timestamp(6) without time zone,
    payment_method character varying(255),
    provider_name character varying(255),
    status character varying(255) NOT NULL,
    transaction_ref character varying(255) NOT NULL,
    updated_at timestamp(6) without time zone,
    user_id bigint NOT NULL,
    CONSTRAINT payment_transactions_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying])::text[])))
);


--
-- Name: payment_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_transactions_id_seq OWNED BY public.payment_transactions.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id bigint NOT NULL,
    name character varying(30) NOT NULL,
    CONSTRAINT roles_name_check CHECK (((name)::text = ANY ((ARRAY['ROLE_FREE'::character varying, 'ROLE_PREMIUM'::character varying, 'ROLE_TEACHER'::character varying, 'ROLE_ADMIN'::character varying])::text[])))
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.roles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    end_date date,
    start_date date,
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    status character varying(255) NOT NULL,
    CONSTRAINT subscriptions_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'EXPIRED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.subscriptions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    level integer,
    score integer,
    streak_days integer,
    xp integer,
    created_at timestamp(6) without time zone,
    id bigint NOT NULL,
    role_id bigint NOT NULL,
    avatar character varying(255),
    email character varying(255) NOT NULL,
    grade character varying(255),
    last_active_date character varying(255),
    nom character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    badges jsonb,
    completed_lesson_ids jsonb,
    quiz_scores jsonb,
    badge_unlocked_at jsonb,
    completed_challenge_ids jsonb,
    completed_exam_ids jsonb
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admin_audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_audit_logs_id_seq'::regclass);


--
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- Name: feature_flags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags ALTER COLUMN id SET DEFAULT nextval('public.feature_flags_id_seq'::regclass);


--
-- Name: payment_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions ALTER COLUMN id SET DEFAULT nextval('public.payment_transactions_id_seq'::regclass);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: cms_courses cms_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_courses
    ADD CONSTRAINT cms_courses_pkey PRIMARY KEY (id);


--
-- Name: cms_curriculum cms_curriculum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_curriculum
    ADD CONSTRAINT cms_curriculum_pkey PRIMARY KEY (id);


--
-- Name: cms_exams cms_exams_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_exams
    ADD CONSTRAINT cms_exams_pkey PRIMARY KEY (id);


--
-- Name: cms_exercises cms_exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cms_exercises
    ADD CONSTRAINT cms_exercises_pkey PRIMARY KEY (id);


--
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- Name: exam_papers exam_papers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.exam_papers
    ADD CONSTRAINT exam_papers_pkey PRIMARY KEY (id);


--
-- Name: feature_flags feature_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT feature_flags_pkey PRIMARY KEY (id);


--
-- Name: payment_receipts payment_receipts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_receipts
    ADD CONSTRAINT payment_receipts_pkey PRIMARY KEY (id);


--
-- Name: payment_transactions payment_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT payment_transactions_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);


--
-- Name: payment_transactions uk_5gn785yw3s6bvpwbb9nt6e6f3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT uk_5gn785yw3s6bvpwbb9nt6e6f3 UNIQUE (checkout_id);


--
-- Name: feature_flags uk_skcd9wyo2a2obbkyusix9emod; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feature_flags
    ADD CONSTRAINT uk_skcd9wyo2a2obbkyusix9emod UNIQUE (flag_key);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: payment_receipts fk5sa73914j72vskjxn5kvjpoc9; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_receipts
    ADD CONSTRAINT fk5sa73914j72vskjxn5kvjpoc9 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: subscriptions fkhro52ohfqfbay9774bev0qinr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT fkhro52ohfqfbay9774bev0qinr FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payment_transactions fko4904wf3pxl3mbx5ntf52h70w; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_transactions
    ADD CONSTRAINT fko4904wf3pxl3mbx5ntf52h70w FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users fkp56c1712k691lhsyewcssf40f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fkp56c1712k691lhsyewcssf40f FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- PostgreSQL database dump complete
--


