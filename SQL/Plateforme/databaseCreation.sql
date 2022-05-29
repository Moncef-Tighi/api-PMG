CREATE TABLE employee (
	id_employe SERIAL PRIMARY KEY,
	email VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25),
    poste VARCHAR(25),
    active BOOLEAN DEFAULT true,
	date_creation TIMESTAMP NOT NULL
);

CREATE TABLE roles (
	id_role SERIAL PRIMARY KEY,
    nom_role VARCHAR(25) NOT NULL
);

CREATE TABLE permissions (
    id_employe INT NOT NULL,
    id_role INT NOT NULL,
    PRIMARY KEY(id_employe, id_role),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe),
    CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE TABLE historique_actions (
	id_action SERIAL PRIMARY KEY,
    --id_employe : l'employé ayant effectué l'action.
    id_employe INT NOT NULL,
    --Action_sur : ID de l'objet affecté par l'action.
    --On peut join en utilisant la catégorie pour savoir à quel table l'objet affecté appartient
    action_sur text NOT NULL,
    --Catégorie : Employé, Commande, Permissions...
    categorie text,
    --Type : Création, supression, modification...
    type text,
    date_creation TIMESTAMP NOT NULL,
    description text,
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe)
);

CREATE TABLE article (
    code_article VARCHAR(50) PRIMARY KEY,
    date_ajout TIMESTAMP NOT NULL,
    date_modification TIMESTAMP,
    prix_initial REAl NOT NULL,
    prix_vente REAL NOT NULL,
    libelle VARCHAR(255),
    marque VARCHAR(25),
    gender VARCHAR(25),
    division VARCHAR(25),
    silhouette VARCHAR(25),
    description TEXT,
    id_article_WooCommerce INT,
    activé BOOLEAN DEFAULT true
);

CREATE TABLE article_taille (
    code_article VARCHAR(255) NOT NULL,
    code_barre VARCHAR(255) PRIMARY KEY,
    dimension VARCHAR(25) NOT NULL,
    stock_dimension INT DEFAULT 0 NOT NULL,
    disponible BOOLEAN DEFAULT false,
    id_taille_WooCommerce INT,
    CONSTRAINT fk_article FOREIGN KEY (code_article) REFERENCES article(code_article)
);

-- CREATE TABLE article_categorie (
--     code_article VARCHAR(255) NOT NULL,
--     code_categorie INT NOT NULL,

--     PRIMARY KEY (code_article, code_categorie),
--     CONSTRAINT fk_article_categorie FOREIGN KEY (code_article) REFERENCES article(code_article),
--     CONSTRAINT fk_categorie FOREIGN KEY (code_categorie) REFERENCES categorie(code_categorie)
-- );

-- CREATE TABLE categorie (
--     code_categorie SERIAL PRIMARY KEY,
--     nom_categorie VARCHAR(25)
-- );

CREATE INDEX index_date_ajout ON article(date_ajout) WHERE activé IS TRUE;