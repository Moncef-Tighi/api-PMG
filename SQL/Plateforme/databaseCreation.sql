CREATE TABLE employee (
    id_employe int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    email VARCHAR ( 50 ) UNIQUE NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25),
    poste VARCHAR(25),
    active BOOLEAN DEFAULT true,
    date_creation TIMESTAMP DEFAULT now()
);

CREATE TABLE roles (
    id_role int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
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
    id_action int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_employe INT NOT NULL,
    action_sur text NOT NULL,
    categorie text,
    type text,
    date_creation TIMESTAMP DEFAULT now(),
    description text,
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe)
);

CREATE TABLE article (
    code_article VARCHAR(50) PRIMARY KEY,
    date_ajout TIMESTAMP DEFAULT now(),
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

CREATE TABLE prestataire (
    id_prestataire int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom_prestataire VARCHAR(50) NOT NULL,
    url_api TEXT NOT NULL
);

CREATE TABLE wilaya (
    numero_wilaya INT PRIMARY KEY,
    nom_wilaya VARCHAR(50)
);

CREATE TABLE daira (
    numero_daira INT PRIMARY KEY,
    numero_wilaya INT NOT NULL,
    nom_daira VARCHAR(50),
    CONSTRAINT fk_wilaya FOREIGN KEY (numero_wilaya) REFERENCES wilaya(numero_wilaya)
);

CREATE TABLE commune (
    numero_commune INT PRIMARY KEY,
    numero_daira INT NOT NULL,
    nom_commune VARCHAR(50),
    CONSTRAINT fk_daira FOREIGN KEY (numero_daira) REFERENCES daira(numero_daira)

);

CREATE TABLE commande (
    id_commande int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_prestataire INT NOT NULL,
    nom_client VARCHAR(100) NOT NULL,
    prenom_client VARCHAR(100) NOT NULL,
    numero_client VARCHAR(100) NOT NULL,
    email_client VARCHAR(200) NOT NULL,
    commande_date_debut TIMESTAMP DEFAULT now(),
    commande_date_fin TIMESTAMP,
    numero_commune INT NOT NULL,
    adresse TEXT,
    provenance VARCHAR(50),
    confirmation BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    CONSTRAINT fk_commune FOREIGN KEY (numero_commune) REFERENCES commune(numero_commune),
    CONSTRAINT fk_prestataire FOREIGN KEY (id_prestataire) REFERENCES prestataire(id_prestataire)
);

CREATE TABLE commande_attribution (
    id_attribution int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_commande INT NOT NULL,
    id_employe INT NOT NULL,
    date_attribution TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe),
    CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES commande(id_commande)
);

CREATE TABLE historique_commande (
    id_historique int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_commande INT NOT NULL,
    id_employe INT NOT NULL,
    date_action TIMESTAMP DEFAULT now(),
    type VARCHAR(25),
    description TEXT,
    commentaire TEXT,
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe),
    CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES commande(id_commande)
);


CREATE TABLE liste_status_commande(
    id_status int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE status_commande (
    id_commande INT NOT NULL,
    id_status INT NOT NULL,
    commentaire TEXT,
    status_date TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES commande(id_commande),
    CONSTRAINT fk_status FOREIGN KEY (id_status) REFERENCES liste_status_commande(id_status)
);

CREATE TABLE livraison(
    id_livraison int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_commande INT NOT NULL,
    date_debut TIMESTAMP DEFAULT now(),
    date_fin TIMESTAMP,
    frais_livraison REAl,
    CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES commande(id_commande)
);

CREATE TABLE ramassage(
    id_ramassage int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    nom_magasin VARCHAR(100) NOT NULL,
    id_article_commande INT NOT NULL,
    confirmation_prestataire BOOLEAN DEFAULT false,
    confirmation_magasin BOOLEAN DEFAULT false,
    date_demande_ramassage TIMESTAMP DEFAULT now(),
    date_confirmation_magasin TIMESTAMP,
    date_confirmation_prestataire TIMESTAMP
    CONSTRAINT fk_article_commande FOREIGN KEY (id_article_commande) REFERENCES article_commande(id_article_commande)
);

CREATE TABLE article_commande (
    id_article_commande int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    id_commande INT NOT NULL,
    code_barre VARCHAR(255),
    quantite INT NOT NULL,
    prix_vente REAL NOT NULL,
    --On ne peut pas les avoir en primary key parce qu'on a besoin d'une primary key non composite pour servir de foreing key
    -- PRIMARY KEY(code_barre, id_commande),
    CONSTRAINT fk_commande FOREIGN KEY (id_commande) REFERENCES commande(id_commande)
);



CREATE INDEX index_date_ajout ON article(date_ajout) WHERE activé IS TRUE;
CREATE INDEX index_date_modification ON article(date_modification) WHERE activé IS TRUE;
CREATE INDEX index_categorie ON article(marque,gender,division,silhouette);
CREATE INDEX index_taille_code_barre ON article_taille(code_barre, dimension);
CREATE INDEX index_taille_stock ON article_taille(stock_dimension);
CREATE INDEX index_commande_date_debut ON commande(commande_date_debut);
CREATE INDEX index_commande_code_barre ON article_commande(code_barre);