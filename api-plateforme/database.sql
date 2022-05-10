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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: article; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public.article (
    code_article character varying(255) NOT NULL,
    date_ajout timestamp without time zone NOT NULL,
    date_creation timestamp without time zone,
    prix_vente real NOT NULL,
    libelle character varying(100),
    marque character varying(100),
    type character varying(100),
    description text,
    tags character varying(100),
    "activé" boolean DEFAULT true
);


ALTER TABLE public.article OWNER TO "Moncef";

--
-- Name: article_taille; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public.article_taille (
    code_barre character varying(255) NOT NULL,
    code_article character varying(255),
    dimension character varying(25) NOT NULL
);


ALTER TABLE public.article_taille OWNER TO "Moncef";

--
-- Name: employé; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public."employé" (
    id_employe integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    nom character varying(25) NOT NULL,
    prenom character varying(25),
    poste character varying(25),
    "activé" boolean DEFAULT true,
    date_creation timestamp without time zone NOT NULL
);


ALTER TABLE public."employé" OWNER TO "Moncef";

--
-- Name: employé_id_employe_seq; Type: SEQUENCE; Schema: public; Owner: Moncef
--

ALTER TABLE public."employé" ALTER COLUMN id_employe ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."employé_id_employe_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: historique_actions; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public.historique_actions (
    id_action integer NOT NULL,
    id_employe integer NOT NULL,
    action_sur text NOT NULL,
    categorie text,
    type text,
    date_creation timestamp without time zone NOT NULL,
    description text
);


ALTER TABLE public.historique_actions OWNER TO "Moncef";

--
-- Name: historique_actions_id_action_seq; Type: SEQUENCE; Schema: public; Owner: Moncef
--

ALTER TABLE public.historique_actions ALTER COLUMN id_action ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.historique_actions_id_action_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public.permissions (
    id_employe integer NOT NULL,
    id_role integer NOT NULL
);


ALTER TABLE public.permissions OWNER TO "Moncef";

--
-- Name: roles; Type: TABLE; Schema: public; Owner: Moncef
--

CREATE TABLE public.roles (
    id_role integer NOT NULL,
    nom_role character varying(25) NOT NULL
);


ALTER TABLE public.roles OWNER TO "Moncef";

--
-- Name: roles_id_role_seq; Type: SEQUENCE; Schema: public; Owner: Moncef
--

ALTER TABLE public.roles ALTER COLUMN id_role ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.roles_id_role_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public.article (code_article, date_ajout, date_creation, prix_vente, libelle, marque, type, description, tags, "activé") FROM stdin;
954385-023	2022-04-28 11:56:23.053844	2017-09-10 14:19:22	2200	BOYS KNIT PANTS /60% COTTON 40% POLYESTER	JORDAN	APPAREL	Aucune description	osef	t
705393-300	2022-04-28 11:54:00.705454	2015-07-12 13:03:38	5400	AIR MAX 1 FB BG	NIKE	FOOTWEAR	Aucune description	osef	t
M20326	2022-04-28 11:51:05.603203	2017-06-02 18:19:00	4000	STAN SMITH	ADIDAS	FOOTWEAR	Aucune description	osef	t
\.


--
-- Data for Name: article_taille; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public.article_taille (code_barre, code_article, dimension) FROM stdin;
4054067760656	M20326	37
4054067760748	M20326	9/43
4054067760755	M20326	9-/44
4054067760762	M20326	44.5
091204280947	705393-300	7Y
009328920502	954385-023	SM
009328920526	954385-023	LRG
009328920519	954385-023	MED
009328920533	954385-023	XLG
\.


--
-- Data for Name: employé; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public."employé" (id_employe, email, password, nom, prenom, poste, "activé", date_creation) FROM stdin;
3	admin@gmail.com	$2b$10$tEbxTV47jJT2tWWGa/XFWep/dsOBbRtgOsqPLzkCxAgxZ6JH5GvbG	admin		Test	t	2022-04-25 14:26:26.868711
7	monce@gmail.com	Tighiouart	Moncef	osef		t	2022-04-27 11:26:06.554855
5	moncef@gmail.com	$2b$10$xbEKPr9vXIgCx4nQYp.lcu.cyU9y2q50NZgA7eiz8Or/3Y.y2TyJq	Tighiouart	Moncef	osef	t	2022-04-25 14:28:02.290243
12	test@gmail.com	$2b$10$aBgCryRS2.TCkO6CC0uMG.HIYLnZfwMJVmhcJFO8FlKMXXL1vpzxa	Test	test	Test	t	2022-05-07 16:10:42.020684
14	vfrz@gmail.com	$2b$10$PYoWDWxat1IZ73OzITAZpeY7A1mDvtMJMz32sZU7FFPX41.zzNxD2	Test	test	Test	t	2022-05-07 16:12:47.815542
15	freg@gmail.com	$2b$10$KsLmaDbwSi/2mcEDRK/CeOBpjR1zQXHrXpKFOxw0P1g3eYbu/AUwa	Test	test	Test	t	2022-05-07 16:13:22.662014
16	fezfe@gmail.com	$2b$10$21MPCN.h3.tCEMNl5x4LcO8Ap5Tnv0o3PfJXNCKr/Ng7Iew5yLG0a	Test	test	Test	t	2022-05-07 16:15:52.377944
17	simple@gmail.com	$2b$10$T9bgAXbBNOyDekWrEQ85leNoWUyNLsnekyU1o0ed5XH46IFQEhfym	simple	simple	simple	t	2022-05-10 10:28:36.593088
\.


--
-- Data for Name: historique_actions; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public.historique_actions (id_action, id_employe, action_sur, categorie, type, date_creation, description) FROM stdin;
1	3	16	employe	admin  a créé l'employé Test test	2022-05-07 16:15:52.388621	ajout
2	3	5	permission	admin  a ajouté la permission modification à moncef@gmail.com 	2022-05-07 17:36:02.615663	admin
3	3	5	permission	admin  a retiré la permission modification à moncef@gmail.com 	2022-05-07 17:38:15.286317	admin
4	5	17	employe	Tighiouart Moncef a créé l'employé simple simple	2022-05-10 10:28:36.60428	ajout
5	5	17	employe	Tighiouart Moncef a ajouté la permission commmande_all à simple@gmail.com 	2022-05-10 10:31:06.726764	admin
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public.permissions (id_employe, id_role) FROM stdin;
3	8
3	9
5	8
17	10
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: Moncef
--

COPY public.roles (id_role, nom_role) FROM stdin;
8	admin
9	modification
10	commmande_all
11	commmande_alger
12	commmande_setif
13	commmande_oran
\.


--
-- Name: employé_id_employe_seq; Type: SEQUENCE SET; Schema: public; Owner: Moncef
--

SELECT pg_catalog.setval('public."employé_id_employe_seq"', 17, true);


--
-- Name: historique_actions_id_action_seq; Type: SEQUENCE SET; Schema: public; Owner: Moncef
--

SELECT pg_catalog.setval('public.historique_actions_id_action_seq', 5, true);


--
-- Name: roles_id_role_seq; Type: SEQUENCE SET; Schema: public; Owner: Moncef
--

SELECT pg_catalog.setval('public.roles_id_role_seq', 13, true);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (code_article);


--
-- Name: article_taille article_taille_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.article_taille
    ADD CONSTRAINT article_taille_pkey PRIMARY KEY (code_barre);


--
-- Name: employé employé_email_key; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public."employé"
    ADD CONSTRAINT "employé_email_key" UNIQUE (email);


--
-- Name: employé employé_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public."employé"
    ADD CONSTRAINT "employé_pkey" PRIMARY KEY (id_employe);


--
-- Name: historique_actions historique_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.historique_actions
    ADD CONSTRAINT historique_actions_pkey PRIMARY KEY (id_action);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id_employe, id_role);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id_role);


--
-- Name: index_date_ajout; Type: INDEX; Schema: public; Owner: Moncef
--

CREATE INDEX index_date_ajout ON public.article USING btree (date_ajout) WHERE ("activé" IS TRUE);


--
-- Name: article_taille fk_article; Type: FK CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.article_taille
    ADD CONSTRAINT fk_article FOREIGN KEY (code_article) REFERENCES public.article(code_article);


--
-- Name: permissions fk_employe; Type: FK CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES public."employé"(id_employe);


--
-- Name: historique_actions fk_employe; Type: FK CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.historique_actions
    ADD CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES public."employé"(id_employe);


--
-- Name: permissions fk_role; Type: FK CONSTRAINT; Schema: public; Owner: Moncef
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES public.roles(id_role);


--
-- PostgreSQL database dump complete
--

