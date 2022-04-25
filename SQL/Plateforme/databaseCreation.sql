DROP TABLE IF EXISTS employé CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS historique_actions CASCADE;
DROP TABLE IF EXISTS article CASCADE;
DROP TABLE IF EXISTS taille CASCADE;

CREATE TABLE employé (
	id_employe INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	login VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25),
    poste VARCHAR(25),
    activé BOOLEAN DEFAULT true,
	date_creation TIMESTAMP NOT NULL
);

CREATE TABLE roles (
	id_role INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    nom_role VARCHAR(25) NOT NULL
);

CREATE TABLE permissions (
	id_permission INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_employe INT NOT NULL,
    id_role INT NOT NULL,
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employé(id_employe),
    CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE historique_actions (
	id_action INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    id_employe INT NOT NULL,
    date_creation TIMESTAMP NOT NULL,
    description text,
    categorie VARCHAR(25),
    type VARCHAR(25),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employé(id_employe)
);

CREATE TABLE article (
    code_article VARCHAR(255) PRIMARY KEY,
    date_ajout TIMESTAMP NOT NULL,
    date_creation TIMESTAMP,
    prix_vente REAL NOT NULL,
    libelle VARCHAR(100),
    familleNiv1 VARCHAR(100),
    familleNiv2 VARCHAR(100),
    description TEXT,
    tags VARCHAR(100),
    activé BOOLEAN DEFAULT true
);

CREATE TABLE taille (
    code_barre VARCHAR(255) PRIMARY KEY,
    code_article VARCHAR(255),
    dimension VARCHAR(25) NOT NULL,
    CONSTRAINT fk_article FOREIGN KEY (code_article) REFERENCES article(code_article)
);

CREATE INDEX index_date_ajout ON article(date_ajout) WHERE activé IS TRUE;