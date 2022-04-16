--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: channel_member_role_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.channel_member_role_enum AS ENUM (
    'admin',
    'member'
);


ALTER TYPE public.channel_member_role_enum OWNER TO admin;

--
-- Name: channel_moderation_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.channel_moderation_type_enum AS ENUM (
    'ban',
    'mute'
);


ALTER TYPE public.channel_moderation_type_enum OWNER TO admin;

--
-- Name: channel_visibility_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.channel_visibility_enum AS ENUM (
    'private',
    'public'
);


ALTER TYPE public.channel_visibility_enum OWNER TO admin;

--
-- Name: user_relationship_type_enum; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.user_relationship_type_enum AS ENUM (
    'block',
    'friend',
    'pending'
);


ALTER TYPE public.user_relationship_type_enum OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: achievement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.achievement (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    description character varying(128) NOT NULL
);


ALTER TABLE public.achievement OWNER TO admin;

--
-- Name: achievement_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.achievement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.achievement_id_seq OWNER TO admin;

--
-- Name: achievement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.achievement_id_seq OWNED BY public.achievement.id;


--
-- Name: channel; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.channel (
    id integer NOT NULL,
    name character varying(32) NOT NULL,
    visibility public.channel_visibility_enum DEFAULT 'private'::public.channel_visibility_enum NOT NULL,
    password character varying(256) DEFAULT NULL::character varying,
    is_password_set boolean DEFAULT false NOT NULL,
    owner_id integer NOT NULL
);


ALTER TABLE public.channel OWNER TO admin;

--
-- Name: channel_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.channel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.channel_id_seq OWNER TO admin;

--
-- Name: channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.channel_id_seq OWNED BY public.channel.id;


--
-- Name: channel_invitation; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.channel_invitation (
    sent_at timestamp without time zone DEFAULT now() NOT NULL,
    channel_id integer NOT NULL,
    to_id integer NOT NULL,
    from_id integer NOT NULL
);


ALTER TABLE public.channel_invitation OWNER TO admin;

--
-- Name: channel_member; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.channel_member (
    role public.channel_member_role_enum DEFAULT 'member'::public.channel_member_role_enum NOT NULL,
    last_read_at timestamp without time zone DEFAULT now() NOT NULL,
    channel_id integer NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.channel_member OWNER TO admin;

--
-- Name: channel_message; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.channel_message (
    channel_id integer NOT NULL,
    message_id integer NOT NULL
);


ALTER TABLE public.channel_message OWNER TO admin;

--
-- Name: channel_moderation; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.channel_moderation (
    type public.channel_moderation_type_enum NOT NULL,
    reason character varying(128) DEFAULT 'No reason'::character varying NOT NULL,
    begin_at timestamp without time zone DEFAULT now() NOT NULL,
    expire_at timestamp without time zone,
    pardon_at timestamp without time zone,
    channel_id integer NOT NULL,
    user_id integer NOT NULL,
    admin_id integer NOT NULL
);


ALTER TABLE public.channel_moderation OWNER TO admin;

--
-- Name: direct_message; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.direct_message (
    read_at timestamp without time zone NOT NULL,
    to_id integer NOT NULL,
    message_id integer NOT NULL
);


ALTER TABLE public.direct_message OWNER TO admin;

--
-- Name: game_map; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.game_map (
    id integer NOT NULL,
    ball_color integer NOT NULL,
    background_color integer NOT NULL,
    stars_color integer NOT NULL,
    racket_color integer NOT NULL
);


ALTER TABLE public.game_map OWNER TO admin;

--
-- Name: game_map_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.game_map_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.game_map_id_seq OWNER TO admin;

--
-- Name: game_map_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.game_map_id_seq OWNED BY public.game_map.id;


--
-- Name: match; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.match (
    id integer NOT NULL,
    mode character varying NOT NULL,
    begin_at timestamp without time zone NOT NULL,
    end_at timestamp without time zone,
    score1 integer DEFAULT 0 NOT NULL,
    score2 integer DEFAULT 0 NOT NULL,
    level integer NOT NULL,
    map_id integer,
    player1_id integer NOT NULL,
    player2_id integer NOT NULL,
    winner_id integer,
    CONSTRAINT "CHK_cf7a03715d23433b28272dad2c" CHECK ((player1_id <> player2_id))
);


ALTER TABLE public.match OWNER TO admin;

--
-- Name: match_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.match_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.match_id_seq OWNER TO admin;

--
-- Name: match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.match_id_seq OWNED BY public.match.id;


--
-- Name: match_invitation; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.match_invitation (
    sent_at timestamp without time zone NOT NULL,
    level integer NOT NULL,
    from_id integer NOT NULL,
    to_id integer NOT NULL,
    map_id integer NOT NULL
);


ALTER TABLE public.match_invitation OWNER TO admin;

--
-- Name: message; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.message (
    id integer NOT NULL,
    content character varying(512) NOT NULL,
    sent_at timestamp without time zone DEFAULT now() NOT NULL,
    from_id integer NOT NULL
);


ALTER TABLE public.message OWNER TO admin;

--
-- Name: message_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.message_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.message_id_seq OWNER TO admin;

--
-- Name: message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.message_id_seq OWNED BY public.message.id;


--
-- Name: typeorm_metadata; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.typeorm_metadata (
    type character varying NOT NULL,
    database character varying,
    schema character varying,
    "table" character varying,
    name character varying,
    value text
);


ALTER TABLE public.typeorm_metadata OWNER TO admin;

--
-- Name: user; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    login character varying(32) NOT NULL,
    nickname character varying(10) NOT NULL,
    xp integer DEFAULT 0 NOT NULL,
    twofa_secret character varying(32) DEFAULT ''::character varying NOT NULL,
    twofa boolean DEFAULT false NOT NULL,
    new_user boolean DEFAULT true NOT NULL,
    avatar_path character varying(64) DEFAULT 'avatars/default.jpg'::character varying NOT NULL
);


ALTER TABLE public."user" OWNER TO admin;

--
-- Name: user_achievement; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_achievement (
    unlocked_at timestamp without time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL,
    achievement_id integer NOT NULL
);


ALTER TABLE public.user_achievement OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO admin;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_relationship; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.user_relationship (
    type public.user_relationship_type_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    from_id integer NOT NULL,
    to_id integer NOT NULL,
    CONSTRAINT "CHK_b8871b91d9cb790945f9f7e744" CHECK ((from_id <> to_id))
);


ALTER TABLE public.user_relationship OWNER TO admin;

--
-- Name: achievement id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.achievement ALTER COLUMN id SET DEFAULT nextval('public.achievement_id_seq'::regclass);


--
-- Name: channel id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel ALTER COLUMN id SET DEFAULT nextval('public.channel_id_seq'::regclass);


--
-- Name: game_map id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.game_map ALTER COLUMN id SET DEFAULT nextval('public.game_map_id_seq'::regclass);


--
-- Name: match id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match ALTER COLUMN id SET DEFAULT nextval('public.match_id_seq'::regclass);


--
-- Name: message id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.message ALTER COLUMN id SET DEFAULT nextval('public.message_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: achievement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.achievement (id, name, description) FROM stdin;
1	win 1	win a game in ranked
2	combo 5	win 5 games in a row
3	loser combo 5	lose 5 games in a row
4	fanny	win 11 against 0
\.


--
-- Data for Name: channel; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.channel (id, name, visibility, password, is_password_set, owner_id) FROM stdin;
\.


--
-- Data for Name: channel_invitation; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.channel_invitation (sent_at, channel_id, to_id, from_id) FROM stdin;
\.


--
-- Data for Name: channel_member; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.channel_member (role, last_read_at, channel_id, user_id) FROM stdin;
\.


--
-- Data for Name: channel_message; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.channel_message (channel_id, message_id) FROM stdin;
\.


--
-- Data for Name: channel_moderation; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.channel_moderation (type, reason, begin_at, expire_at, pardon_at, channel_id, user_id, admin_id) FROM stdin;
\.


--
-- Data for Name: direct_message; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.direct_message (read_at, to_id, message_id) FROM stdin;
\.


--
-- Data for Name: game_map; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.game_map (id, ball_color, background_color, stars_color, racket_color) FROM stdin;
1	16562691	0	0	16777215
2	16562691	344663	12566194	16777215
3	11537257	921893	11831040	8598112
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.match (id, mode, begin_at, end_at, score1, score2, level, map_id, player1_id, player2_id, winner_id) FROM stdin;
\.


--
-- Data for Name: match_invitation; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.match_invitation (sent_at, level, from_id, to_id, map_id) FROM stdin;
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.message (id, content, sent_at, from_id) FROM stdin;
\.


--
-- Data for Name: typeorm_metadata; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.typeorm_metadata (type, database, schema, "table", name, value) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public."user" (id, login, nickname, xp, twofa_secret, twofa, new_user, avatar_path) FROM stdin;
\.


--
-- Data for Name: user_achievement; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_achievement (unlocked_at, user_id, achievement_id) FROM stdin;
\.


--
-- Data for Name: user_relationship; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.user_relationship (type, created_at, from_id, to_id) FROM stdin;
\.


--
-- Name: achievement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.achievement_id_seq', 4, true);


--
-- Name: channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.channel_id_seq', 1, false);


--
-- Name: game_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.game_map_id_seq', 3, true);


--
-- Name: match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.match_id_seq', 1, false);


--
-- Name: message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.message_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.user_id_seq', 1, false);


--
-- Name: game_map PK_15dca7a4369ac466eea4cbacd2b; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.game_map
    ADD CONSTRAINT "PK_15dca7a4369ac466eea4cbacd2b" PRIMARY KEY (id);


--
-- Name: achievement PK_441339f40e8ce717525a381671e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "PK_441339f40e8ce717525a381671e" PRIMARY KEY (id);


--
-- Name: user_achievement PK_47db305cc6e77e8f88fe0aec8cd; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_achievement
    ADD CONSTRAINT "PK_47db305cc6e77e8f88fe0aec8cd" PRIMARY KEY (user_id, achievement_id);


--
-- Name: channel PK_590f33ee6ee7d76437acf362e39; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "PK_590f33ee6ee7d76437acf362e39" PRIMARY KEY (id);


--
-- Name: channel_invitation PK_7109c3409f6e4a9fc44c669efdf; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_invitation
    ADD CONSTRAINT "PK_7109c3409f6e4a9fc44c669efdf" PRIMARY KEY (channel_id, to_id);


--
-- Name: channel_message PK_8c7ccaf0ef2bb93ee722c2b171f; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_message
    ADD CONSTRAINT "PK_8c7ccaf0ef2bb93ee722c2b171f" PRIMARY KEY (channel_id, message_id);


--
-- Name: match PK_92b6c3a6631dd5b24a67c69f69d; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "PK_92b6c3a6631dd5b24a67c69f69d" PRIMARY KEY (id);


--
-- Name: channel_moderation PK_a21ae3183ed710b6afb24f43b13; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_moderation
    ADD CONSTRAINT "PK_a21ae3183ed710b6afb24f43b13" PRIMARY KEY (channel_id, user_id);


--
-- Name: message PK_ba01f0a3e0123651915008bc578; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: user_relationship PK_dd4d9d72b599155c2978d941649; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_relationship
    ADD CONSTRAINT "PK_dd4d9d72b599155c2978d941649" PRIMARY KEY (from_id, to_id);


--
-- Name: channel_member PK_edb8fe647ddc36f407f06812cd6; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_member
    ADD CONSTRAINT "PK_edb8fe647ddc36f407f06812cd6" PRIMARY KEY (channel_id, user_id);


--
-- Name: direct_message PK_ee5adff4e39137b08eff325a518; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.direct_message
    ADD CONSTRAINT "PK_ee5adff4e39137b08eff325a518" PRIMARY KEY (to_id, message_id);


--
-- Name: match_invitation PK_fae8d124bebe5e0e223724fa915; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match_invitation
    ADD CONSTRAINT "PK_fae8d124bebe5e0e223724fa915" PRIMARY KEY (from_id, to_id);


--
-- Name: channel UQ_800e6da7e4c30fbb0653ba7bb6c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "UQ_800e6da7e4c30fbb0653ba7bb6c" UNIQUE (name);


--
-- Name: user UQ_a62473490b3e4578fd683235c5e; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE (login);


--
-- Name: user UQ_e2364281027b926b879fa2fa1e0; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE (nickname);


--
-- Name: achievement UQ_e3c415098b42f5a834e0752394c; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.achievement
    ADD CONSTRAINT "UQ_e3c415098b42f5a834e0752394c" UNIQUE (name);


--
-- Name: channel FK_033c6c164664caf44ca6199d63b; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel
    ADD CONSTRAINT "FK_033c6c164664caf44ca6199d63b" FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- Name: channel_invitation FK_0b4df30ba85f5ca9a112388c2f2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_invitation
    ADD CONSTRAINT "FK_0b4df30ba85f5ca9a112388c2f2" FOREIGN KEY (channel_id) REFERENCES public.channel(id);


--
-- Name: channel_moderation FK_0c7897029cc681be69e10cab1db; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_moderation
    ADD CONSTRAINT "FK_0c7897029cc681be69e10cab1db" FOREIGN KEY (channel_id) REFERENCES public.channel(id);


--
-- Name: channel_invitation FK_1011d088d460ae6f9fe05883ca8; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_invitation
    ADD CONSTRAINT "FK_1011d088d460ae6f9fe05883ca8" FOREIGN KEY (to_id) REFERENCES public."user"(id);


--
-- Name: user_achievement FK_14f2bb86ac0603a47ae089b0d26; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_achievement
    ADD CONSTRAINT "FK_14f2bb86ac0603a47ae089b0d26" FOREIGN KEY (achievement_id) REFERENCES public.achievement(id);


--
-- Name: match FK_2871ab0f2b5024d4bdc13472e4a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_2871ab0f2b5024d4bdc13472e4a" FOREIGN KEY (player1_id) REFERENCES public."user"(id);


--
-- Name: match_invitation FK_351f3e454b61d6908554e464a63; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match_invitation
    ADD CONSTRAINT "FK_351f3e454b61d6908554e464a63" FOREIGN KEY (map_id) REFERENCES public.game_map(id);


--
-- Name: match FK_383e55425736e9b0286e198ce3d; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_383e55425736e9b0286e198ce3d" FOREIGN KEY (winner_id) REFERENCES public."user"(id);


--
-- Name: message FK_47f1ad2240dd9ecfbbcf478d77f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT "FK_47f1ad2240dd9ecfbbcf478d77f" FOREIGN KEY (from_id) REFERENCES public."user"(id);


--
-- Name: channel_invitation FK_5ecf98453c6be8baddf607b250e; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_invitation
    ADD CONSTRAINT "FK_5ecf98453c6be8baddf607b250e" FOREIGN KEY (from_id) REFERENCES public."user"(id);


--
-- Name: channel_moderation FK_6243fb2c58a8603eb1e97666080; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_moderation
    ADD CONSTRAINT "FK_6243fb2c58a8603eb1e97666080" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user_achievement FK_676d00b5a31b28beaab0617b265; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_achievement
    ADD CONSTRAINT "FK_676d00b5a31b28beaab0617b265" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: direct_message FK_77c5fbedb3cb4fb0cca5fb614d2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.direct_message
    ADD CONSTRAINT "FK_77c5fbedb3cb4fb0cca5fb614d2" FOREIGN KEY (to_id) REFERENCES public."user"(id);


--
-- Name: user_relationship FK_7e909ae2b17a9f9ca050db2a9b3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_relationship
    ADD CONSTRAINT "FK_7e909ae2b17a9f9ca050db2a9b3" FOREIGN KEY (to_id) REFERENCES public."user"(id);


--
-- Name: match FK_88acbb5934eb53bdf747efeac92; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_88acbb5934eb53bdf747efeac92" FOREIGN KEY (player2_id) REFERENCES public."user"(id);


--
-- Name: match FK_8c56136ac9176d18563ed5ebb7c; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match
    ADD CONSTRAINT "FK_8c56136ac9176d18563ed5ebb7c" FOREIGN KEY (map_id) REFERENCES public.game_map(id);


--
-- Name: direct_message FK_8cc2701dfe54c912a5798f7f7d9; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.direct_message
    ADD CONSTRAINT "FK_8cc2701dfe54c912a5798f7f7d9" FOREIGN KEY (message_id) REFERENCES public.message(id);


--
-- Name: user_relationship FK_8e3395b22a45032e1740425b31f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.user_relationship
    ADD CONSTRAINT "FK_8e3395b22a45032e1740425b31f" FOREIGN KEY (from_id) REFERENCES public."user"(id);


--
-- Name: channel_moderation FK_9080dcaddf5db1d7ec486a0cbe3; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_moderation
    ADD CONSTRAINT "FK_9080dcaddf5db1d7ec486a0cbe3" FOREIGN KEY (admin_id) REFERENCES public."user"(id);


--
-- Name: match_invitation FK_99e1bf1bd9999e2716341ac76e2; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match_invitation
    ADD CONSTRAINT "FK_99e1bf1bd9999e2716341ac76e2" FOREIGN KEY (to_id) REFERENCES public."user"(id);


--
-- Name: channel_member FK_acb34f60dda89d12956feeedbf4; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_member
    ADD CONSTRAINT "FK_acb34f60dda89d12956feeedbf4" FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: channel_member FK_c0e555240770b2a13a82da4db6e; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_member
    ADD CONSTRAINT "FK_c0e555240770b2a13a82da4db6e" FOREIGN KEY (channel_id) REFERENCES public.channel(id);


--
-- Name: match_invitation FK_c4c2d71cb4b5b3443b5b85c7d1f; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.match_invitation
    ADD CONSTRAINT "FK_c4c2d71cb4b5b3443b5b85c7d1f" FOREIGN KEY (from_id) REFERENCES public."user"(id);


--
-- Name: channel_message FK_c645dc487c1b60ef8746d12bc7a; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_message
    ADD CONSTRAINT "FK_c645dc487c1b60ef8746d12bc7a" FOREIGN KEY (message_id) REFERENCES public.message(id);


--
-- Name: channel_message FK_ec050b7759be7648c58d1165255; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.channel_message
    ADD CONSTRAINT "FK_ec050b7759be7648c58d1165255" FOREIGN KEY (channel_id) REFERENCES public.channel(id);


--
-- PostgreSQL database dump complete
--

