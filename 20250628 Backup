--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Debian 16.9-1.pgdg120+1)
-- Dumped by pg_dump version 17.4

-- Started on 2025-06-28 06:41:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16398)
-- Name: activity; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.activity (
    id integer NOT NULL,
    name text NOT NULL,
    location text,
    has_cost boolean DEFAULT false NOT NULL,
    cost numeric(10,2),
    available_sun boolean DEFAULT false,
    available_mon boolean DEFAULT false,
    available_tue boolean DEFAULT false,
    available_wed boolean DEFAULT false,
    available_thu boolean DEFAULT false,
    available_fri boolean DEFAULT false,
    available_sat boolean DEFAULT false,
    url text,
    description text
);


ALTER TABLE public.activity OWNER TO activity_user;

--
-- TOC entry 216 (class 1259 OID 16411)
-- Name: activity_image; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.activity_image (
    id integer NOT NULL,
    activity_id integer,
    image_url text NOT NULL
);


ALTER TABLE public.activity_image OWNER TO activity_user;

--
-- TOC entry 226 (class 1259 OID 16479)
-- Name: activity_image_id_seq; Type: SEQUENCE; Schema: public; Owner: activity_user
--

CREATE SEQUENCE public.activity_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_image_id_seq OWNER TO activity_user;

--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 226
-- Name: activity_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: activity_user
--

ALTER SEQUENCE public.activity_image_id_seq OWNED BY public.activity_image.id;


--
-- TOC entry 219 (class 1259 OID 16427)
-- Name: chat_member; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.chat_member (
    id integer NOT NULL,
    chat_id integer,
    user_id integer,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    left_at timestamp without time zone
);


ALTER TABLE public.chat_member OWNER TO activity_user;

--
-- TOC entry 225 (class 1259 OID 16465)
-- Name: chat_member_id_seq; Type: SEQUENCE; Schema: public; Owner: activity_user
--

CREATE SEQUENCE public.chat_member_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_member_id_seq OWNER TO activity_user;

--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 225
-- Name: chat_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: activity_user
--

ALTER SEQUENCE public.chat_member_id_seq OWNED BY public.chat_member.id;


--
-- TOC entry 217 (class 1259 OID 16416)
-- Name: activity_member; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.activity_member (
    id integer DEFAULT nextval('public.chat_member_id_seq'::regclass) NOT NULL,
    activity_id integer,
    user_id integer,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_member OWNER TO activity_user;

--
-- TOC entry 218 (class 1259 OID 16420)
-- Name: chat; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.chat (
    id integer NOT NULL,
    chat_type text NOT NULL,
    activity_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_chat_type_check CHECK ((chat_type = ANY (ARRAY['activity'::text, 'direct'::text])))
);


ALTER TABLE public.chat OWNER TO activity_user;

--
-- TOC entry 224 (class 1259 OID 16463)
-- Name: chat_id_seq; Type: SEQUENCE; Schema: public; Owner: activity_user
--

CREATE SEQUENCE public.chat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_id_seq OWNER TO activity_user;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 224
-- Name: chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: activity_user
--

ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;


--
-- TOC entry 220 (class 1259 OID 16431)
-- Name: message; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.message (
    id integer DEFAULT nextval('public.chat_member_id_seq'::regclass) NOT NULL,
    user_id integer,
    content text NOT NULL,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chat_id integer
);


ALTER TABLE public.message OWNER TO activity_user;

--
-- TOC entry 221 (class 1259 OID 16437)
-- Name: swipe; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public.swipe (
    id integer NOT NULL,
    user_id integer,
    activity_id integer,
    liked boolean NOT NULL,
    swiped_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.swipe OWNER TO activity_user;

--
-- TOC entry 227 (class 1259 OID 16485)
-- Name: swipe_id_seq; Type: SEQUENCE; Schema: public; Owner: activity_user
--

ALTER TABLE public.swipe ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.swipe_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 16441)
-- Name: user; Type: TABLE; Schema: public; Owner: activity_user
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    profile_image text,
    first_name text DEFAULT ''::text NOT NULL,
    last_name text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."user" OWNER TO activity_user;

--
-- TOC entry 223 (class 1259 OID 16454)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: activity_user
--

ALTER TABLE public."user" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3241 (class 2604 OID 16480)
-- Name: activity_image id; Type: DEFAULT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.activity_image ALTER COLUMN id SET DEFAULT nextval('public.activity_image_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 16464)
-- Name: chat id; Type: DEFAULT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 16466)
-- Name: chat_member id; Type: DEFAULT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat_member ALTER COLUMN id SET DEFAULT nextval('public.chat_member_id_seq'::regclass);


--
-- TOC entry 3421 (class 0 OID 16398)
-- Dependencies: 215
-- Data for Name: activity; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.activity VALUES (1, 'Disc Golf', 'Local Disc Golf Course', false, NULL, true, true, true, true, true, true, true, 'https://www.pdga.com/courses', 'Disc Golf is an outdoor sport where players throw a flying disc at a target. Enjoy a game at your local disc golf course!');
INSERT INTO public.activity VALUES (2, 'Hiking The Tetons', 'Grand Teton National Park', true, 5.00, true, true, true, true, true, true, true, 'https://www.nps.gov/grte/index.htm', 'Explore the stunning trails of the Grand Teton National Park. A perfect adventure for hikers of all skill levels!');
INSERT INTO public.activity VALUES (3, 'Sunset Yoga in the Park', 'Central City Park', false, NULL, true, true, true, true, true, true, true, 'https://example.com/yoga', 'Join a relaxing group yoga session as the sun sets. All skill levels welcome!');
INSERT INTO public.activity VALUES (4, 'Board Game Night', 'Downtown Community Center', false, NULL, false, true, false, true, false, true, false, 'https://example.com/boardgames', 'Bring your favorite board games or try something new. Snacks provided!');
INSERT INTO public.activity VALUES (5, 'Art Walk Tour', 'City Art District', false, NULL, false, false, false, false, true, true, true, 'https://example.com/artwalk', 'Explore local galleries and street art with a guided walking tour.');
INSERT INTO public.activity VALUES (6, 'Kayaking Adventure', 'Riverbend Launch Site', true, 20.00, true, false, false, false, false, true, true, 'https://example.com/kayak', 'Paddle down the river with a group. Equipment rental included in cost.');
INSERT INTO public.activity VALUES (7, 'Cooking Class: Italian Night', 'Chef Kitchen Studio', true, 35.00, false, true, false, false, false, false, true, 'https://example.com/cooking', 'Learn to make classic Italian dishes from scratch in a fun, hands-on class.');


--
-- TOC entry 3422 (class 0 OID 16411)
-- Dependencies: 216
-- Data for Name: activity_image; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.activity_image VALUES (1, 1, 'http://activity-app-server.onrender.com/public/images/activities/image1.jpg');
INSERT INTO public.activity_image VALUES (2, 1, 'http://activity-app-server.onrender.com/public/images/activities/image2.webp');
INSERT INTO public.activity_image VALUES (3, 1, 'http://activity-app-server.onrender.com/public/images/activities/image3.webp');
INSERT INTO public.activity_image VALUES (4, 1, 'http://activity-app-server.onrender.com/public/images/activities/image4.webp');
INSERT INTO public.activity_image VALUES (5, 2, 'http://activity-app-server.onrender.com/public/images/activities/image4.png');
INSERT INTO public.activity_image VALUES (6, 2, 'http://activity-app-server.onrender.com/public/images/activities/image5.jpg');
INSERT INTO public.activity_image VALUES (7, 2, 'http://activity-app-server.onrender.com/public/images/activities/image6.png');
INSERT INTO public.activity_image VALUES (8, 3, 'http://activity-app-server.onrender.com/public/images/activities/test_image.png');
INSERT INTO public.activity_image VALUES (10, 5, 'http://activity-app-server.onrender.com/public/images/activities/test_image.png');
INSERT INTO public.activity_image VALUES (11, 6, 'http://activity-app-server.onrender.com/public/images/activities/test_image.png');
INSERT INTO public.activity_image VALUES (12, 7, 'http://activity-app-server.onrender.com/public/images/activities/test_image.png');
INSERT INTO public.activity_image VALUES (9, 4, 'http://activity-app-server.onrender.com/public/images/activities/test_image.png');


--
-- TOC entry 3423 (class 0 OID 16416)
-- Dependencies: 217
-- Data for Name: activity_member; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.activity_member VALUES (16, 2, 3, '2025-06-11 15:04:42.748649');
INSERT INTO public.activity_member VALUES (18, 1, 4, '2025-06-11 15:05:09.06');
INSERT INTO public.activity_member VALUES (33, 2, 2, '2025-06-11 15:50:21.876815');
INSERT INTO public.activity_member VALUES (42, 1, 1, '2025-06-11 16:19:39.155971');
INSERT INTO public.activity_member VALUES (43, 2, 1, '2025-06-11 16:19:50.581405');
INSERT INTO public.activity_member VALUES (44, 1, 2, '2025-06-11 16:20:29.271399');
INSERT INTO public.activity_member VALUES (59, 3, 4, '2025-06-11 16:49:32.821163');
INSERT INTO public.activity_member VALUES (62, 1, 3, '2025-06-11 16:52:41.621767');


--
-- TOC entry 3424 (class 0 OID 16420)
-- Dependencies: 218
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.chat VALUES (3, 'direct', NULL, '2025-03-21 09:57:14.654343');
INSERT INTO public.chat VALUES (4, 'direct', NULL, '2025-03-21 09:57:14.654343');
INSERT INTO public.chat VALUES (1, 'activity', 2, '2025-03-21 09:56:25.887455');
INSERT INTO public.chat VALUES (2, 'activity', 1, '2025-03-21 09:56:25.887455');
INSERT INTO public.chat VALUES (5, 'direct', NULL, '2025-03-21 10:00:14.654343');
INSERT INTO public.chat VALUES (81, 'activity', 5, '2025-06-19 21:58:34.398698');
INSERT INTO public.chat VALUES (8, 'direct', NULL, '2025-04-30 18:53:04.680323');
INSERT INTO public.chat VALUES (9, 'activity', 3, '2025-06-11 15:26:56.628536');
INSERT INTO public.chat VALUES (10, 'direct', NULL, '2025-06-11 16:42:08.415316');
INSERT INTO public.chat VALUES (11, 'direct', NULL, '2025-06-11 16:48:25.692768');
INSERT INTO public.chat VALUES (12, 'direct', NULL, '2025-06-11 16:48:25.904386');
INSERT INTO public.chat VALUES (13, 'direct', NULL, '2025-06-11 16:48:26.112096');
INSERT INTO public.chat VALUES (14, 'direct', NULL, '2025-06-11 16:49:32.986815');
INSERT INTO public.chat VALUES (90, 'activity', 4, '2025-06-20 00:17:47.950347');
INSERT INTO public.chat VALUES (91, 'activity', 7, '2025-06-20 00:17:53.396129');


--
-- TOC entry 3425 (class 0 OID 16427)
-- Dependencies: 219
-- Data for Name: chat_member; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.chat_member VALUES (1, 1, 1, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO public.chat_member VALUES (2, 1, 2, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO public.chat_member VALUES (3, 1, 3, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO public.chat_member VALUES (4, 2, 1, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO public.chat_member VALUES (5, 2, 4, '2025-03-21 09:56:52.467007', NULL);
INSERT INTO public.chat_member VALUES (6, 3, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (7, 3, 2, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (8, 4, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (9, 4, 3, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (10, 5, 1, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (11, 5, 4, '2025-03-21 09:57:28.046644', NULL);
INSERT INTO public.chat_member VALUES (13, 8, 2, '2025-04-30 18:53:04.680323', NULL);
INSERT INTO public.chat_member VALUES (14, 8, 3, '2025-04-30 18:53:04.680323', NULL);
INSERT INTO public.chat_member VALUES (49, 10, 3, '2025-06-11 16:42:08.469421', NULL);
INSERT INTO public.chat_member VALUES (50, 10, 4, '2025-06-11 16:42:08.522972', NULL);
INSERT INTO public.chat_member VALUES (53, 11, 3, '2025-06-11 16:48:25.799386', NULL);
INSERT INTO public.chat_member VALUES (55, 12, 2, '2025-06-11 16:48:26.009325', NULL);
INSERT INTO public.chat_member VALUES (57, 13, 1, '2025-06-11 16:48:26.21845', NULL);
INSERT INTO public.chat_member VALUES (60, 14, 4, '2025-06-11 16:49:33.040732', NULL);


--
-- TOC entry 3426 (class 0 OID 16431)
-- Dependencies: 220
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.message VALUES (1, 1, 'Hey everyone, ready for the hike?', '2025-03-21 09:00:00', 1);
INSERT INTO public.message VALUES (2, 2, 'Yes! I am so excited.', '2025-03-21 09:01:00', 1);
INSERT INTO public.message VALUES (3, 1, 'Who is up for Disc Golf this weekend?', '2025-03-21 09:02:00', 2);
INSERT INTO public.message VALUES (4, 1, 'Hey Kayla, how have you been?', '2025-03-21 09:03:00', 3);
INSERT INTO public.message VALUES (5, 2, 'Hey Test User! I’m good, what about you?', '2025-03-21 09:04:00', 3);
INSERT INTO public.message VALUES (6, 1, 'Eric, did you get the hiking gear?', '2025-03-21 09:05:00', 4);
INSERT INTO public.message VALUES (183, 1, 'Yo!', '2025-06-19 20:14:31.448426', 5);


--
-- TOC entry 3427 (class 0 OID 16437)
-- Dependencies: 221
-- Data for Name: swipe; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (63, 1, 1, true, '2025-06-11 16:19:39.10334');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (64, 1, 2, true, '2025-06-11 16:19:50.531295');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (65, 2, 1, true, '2025-06-11 16:20:29.212369');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (66, 2, 2, true, '2025-06-11 16:20:32.625905');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (68, 3, 2, true, '2025-06-11 16:20:46.755554');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (69, 4, 1, true, '2025-06-11 16:20:52.748644');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (77, 4, 3, true, '2025-06-11 16:49:32.767678');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (78, 3, 1, true, '2025-06-11 16:52:41.564326');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (148, 34, 1, false, '2025-06-19 22:14:08.893567');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (149, 34, 2, false, '2025-06-19 22:14:10.126248');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (150, 34, 3, false, '2025-06-19 22:14:11.645917');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (88, 4, 2, false, '2025-06-11 20:26:43.29649');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (151, 34, 4, false, '2025-06-19 22:14:13.013863');
INSERT INTO public.swipe OVERRIDING SYSTEM VALUE VALUES (152, 34, 5, true, '2025-06-19 22:14:14.149797');


--
-- TOC entry 3428 (class 0 OID 16441)
-- Dependencies: 222
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: activity_user
--

INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (3, 'eric@example.com', '$2b$10$jqKZgXCIOemm9WxOq3yVSeyDhMAO.xRdYqOkGGvqfqlG3n7WDI2vi', 'http://activity-app-server.onrender.com/public/images/users/Eric.jfif', 'Eric', 'Johnson');
INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (4, 'johan@example.com', '$2b$10$jqKZgXCIOemm9WxOq3yVSeyDhMAO.xRdYqOkGGvqfqlG3n7WDI2vi', 'http://activity-app-server.onrender.com/public/images/users/Johan.jfif', 'Johan', 'Andersson');
INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (1, 'sowbyspencer@gmail.com', '$2b$10$JEj634wZOSpZWRgletMIh.do6g.FoRe.L5z0pdT0Pr08KU/LdfOhe', 'http://activity-app-server.onrender.com/public/images/users/1746026475827-profile.jpg', 'Spencer', 'Sowby');
INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (34, 'bob@bob.com', '$2b$10$Uxmz64025RA9i0Gn8xbxX.QROMdwn9h0bA5uIAs5LsOu/LRcgDpyq', NULL, 'A', 'A');
INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (2, 'kayla@example.com', '$2b$10$87QTIg.Nojwz/RuTOq1hnOXT7pz5iwjsY88ufgyBADErVVcPCfQRa', 'http://activity-app-server.onrender.com/public/images/users/Kayla.jfif', 'Kayla', 'Smith');
INSERT INTO public."user" OVERRIDING SYSTEM VALUE VALUES (12, 'new_user@example.com', '$2b$10$jqKZgXCIOemm9WxOq3yVSeyDhMAO.xRdYqOkGGvqfqlG3n7WDI2vi', NULL, 'New', 'User');


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 226
-- Name: activity_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: activity_user
--

SELECT pg_catalog.setval('public.activity_image_id_seq', 1, false);


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 224
-- Name: chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: activity_user
--

SELECT pg_catalog.setval('public.chat_id_seq', 91, true);


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 225
-- Name: chat_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: activity_user
--

SELECT pg_catalog.setval('public.chat_member_id_seq', 326, true);


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 227
-- Name: swipe_id_seq; Type: SEQUENCE SET; Schema: public; Owner: activity_user
--

SELECT pg_catalog.setval('public.swipe_id_seq', 170, true);


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: activity_user
--

SELECT pg_catalog.setval('public.user_id_seq', 35, true);


--
-- TOC entry 3257 (class 2606 OID 16484)
-- Name: activity_image activity_image_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.activity_image
    ADD CONSTRAINT activity_image_pkey PRIMARY KEY (id);


--
-- TOC entry 3259 (class 2606 OID 16476)
-- Name: activity_member activity_member_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.activity_member
    ADD CONSTRAINT activity_member_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 16492)
-- Name: activity activity_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.activity
    ADD CONSTRAINT activity_pkey PRIMARY KEY (id);


--
-- TOC entry 3263 (class 2606 OID 16470)
-- Name: chat_member chat_member_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat_member
    ADD CONSTRAINT chat_member_pkey PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16473)
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 16468)
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 16490)
-- Name: swipe swipe_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.swipe
    ADD CONSTRAINT swipe_pkey PRIMARY KEY (id);


--
-- TOC entry 3269 (class 2606 OID 16462)
-- Name: user unique_email; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- TOC entry 3271 (class 2606 OID 16458)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 16503)
-- Name: activity_member activity_member_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.activity_member
    ADD CONSTRAINT activity_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3273 (class 2606 OID 16523)
-- Name: chat_member chat_member_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat_member
    ADD CONSTRAINT chat_member_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- TOC entry 3274 (class 2606 OID 16498)
-- Name: chat_member chat_member_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.chat_member
    ADD CONSTRAINT chat_member_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3275 (class 2606 OID 16528)
-- Name: message message_chat_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES public.chat(id) ON DELETE CASCADE;


--
-- TOC entry 3276 (class 2606 OID 16493)
-- Name: message message_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3277 (class 2606 OID 16508)
-- Name: swipe swipe_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: activity_user
--

ALTER TABLE ONLY public.swipe
    ADD CONSTRAINT swipe_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE activity; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.activity TO postgres;


--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 216
-- Name: TABLE activity_image; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.activity_image TO postgres;


--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE chat_member; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.chat_member TO postgres;


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE activity_member; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.activity_member TO postgres;


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE chat; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.chat TO postgres;


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE message; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.message TO postgres;


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE swipe; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public.swipe TO postgres;


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE "user"; Type: ACL; Schema: public; Owner: activity_user
--

GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE public."user" TO postgres;


-- Completed on 2025-06-28 06:41:43

--
-- PostgreSQL database dump complete
--

