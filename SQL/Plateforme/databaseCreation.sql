DROP TABLE IF EXISTS employé;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS historique_actions;
DROP TABLE IF EXISTS article;

CREATE TABLE employé (
	id_employe INT PRIMARY KEY generated as identity,
	login VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	salt VARCHAR ( 255 ) UNIQUE NOT NULL,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25),
    poste VARCHAR(25),
    activé BOOLEAN,
	date_creation TIMESTAMP NOT NULL,
);

CREATE TABLE roles (
	id_role INT PRIMARY KEY generated as identity,
    nom_role VARCHAR(25) NOT NULL
);

CREATE TABLE permissions (
	id_permission INT PRIMARY KEY generated as identity,
    id_employe INT NOT NULL,
    id_role INT NOT NULL,
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES (employé)
    CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES (roles)
);

CREATE TABLE historique_actions (
	id_action INT PRIMARY KEY generated as identity,
    id_employe INT NOT NULL,
    date_creation TIMESTAMP NOT NULL,
    description text,
    categorie VARCHAR(25),
    type VARCHAR(25),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES (employé)
);

CREATE TABLE article (
    code_article VARCHAR(255) PRIMARY KEY,
    date_ajout TIMESTAMP NOT NULL,
    date_creation TIMESTAMP,
    prix_vente DECIMAL NOT NULL,
    libelle VARCHAR(100),
    familleNiv1 VARCHAR(100),
    familleNiv2 VARCHAR(100)
    description TEXT,
    tags VARCHAR(100),
    activé BOOLEAN
)

CREATE TABLE taille
    code_barre VARCHAR(255) PRIMARY KEY,
    code_article VARCHAR(255),
    dimension VARCHAR(25) NOT NULL,
    CONSTRAINT fk_article FOREIGN KEY (code_article) REFERENCES (article)
