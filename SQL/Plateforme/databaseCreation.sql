CREATE TABLE employee (
	id_employe SERIAL PRIMARY KEY,
	email VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
    nom VARCHAR(25) NOT NULL,
    prenom VARCHAR(25),
    poste VARCHAR(25),
    active BOOLEAN DEFAULT true,
	date_creation TIMESTAMP DEFAULT now()
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

CREATE TABLE commande (
    commande_id SERIAL PRIMARY KEY,
    nom_client VARCHAR(100) NOT NULL,
    prenom_client VARCHAR(100) NOT NULL,
    numero_client VARCHAR(100) NOT NULL,
    email_client VARCHAR(200) NOT NULL,
    commande_date_debut TIMESTAMP DEFAULT now(),
    commande_date_fin TIMESTAMP,
    numero_wilaya INT NOT NULL,
    numero_daira INT NOT NULL,
    numero_baladia INT NOT NULL,
    adresse TEXT,
    provenance VARCHAR(50),
    active BOOLEAN DEFAULT true
)

CREATE TABLE wilaya (
    numero_wilaya INT PRIMARY KEY,
    nom_wilaya VARCHAR(50),
)

CREATE TABLE daira (
    numero_daira INT PRIMARY KEY,
    nom_daira VARCHAR(50)
)

CREATE TABLE baladia (
    numero_baladia INT PRIMARY KEY,
    nom_baladia VARCHAR(50)
)

CREATE TABLE commande_attribution (
    commande_id INT NOT NULL,
    id_employe INT NOT NULL,
    date_attribution TIMESTAMP DEFAULT now(),
    PRIMARY KEY(id_employe, commande_id),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe),
    CONSTRAINT fk_commande FOREIGN KEY (commande_id) REFERENCES commande(commande_id)
)

CREATE TABLE historique_commande (
    commande_id INT NOT NULL,
    id_employe INT NOT NULL,
    date_action TIMESTAMP DEFAULT now(),
    type VARCHAR(25),
    description TEXT,
    commentaire TEXT,
    PRIMARY KEY(id_employe, commande_id),
    CONSTRAINT fk_employe FOREIGN KEY (id_employe) REFERENCES employee(id_employe),
    CONSTRAINT fk_commande FOREIGN KEY (commande_id) REFERENCES commande(commande_id)
)

CREATE TABLE status_commande (
    id_status SERIAL PRIMARY KEY,
    id_commande INT NOT NULL,
    id_status INT NOT NULL,
    commentaire TEXT,
    status_date TIMESTAMP DEFAULT now(),
    CONSTRAINT fk_commande FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
    CONSTRAINT fk_status FOREIGN KEY (id_status) REFERENCES liste_status_commande(id_status)
)

CREATE TABLE liste_status_commande(
    id_status SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL
)

CREATE TABLE livraison(
    id_livraison SERIAL PRIMARY KEY,
    id_commande INT NOT NULL,
    id_prestataire INT NOT NULL,
    date_debut TIMESTAMP DEFAULT now(),
    date_fin TIMESTAMP,
    frais_livraison REAl,
    CONSTRAINT fk_commande FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
    CONSTRAINT fk_prestataire FOREIGN KEY (id_prestataire) REFERENCES prestataires(id_prestataire)
)

CREATE TABLE prestataire (
    id_prestataire SERIAL PRIMARY KEY,
    nom_prestataire VARCHAR(50) NOT NULL,
    url_api TEXT NOT NULL
)

CREATE TABLE ramassage(
    id_lieu_ramassage SERIAL PRIMARY KEY,
    nom_lieu_ramassage VARCHAR(100) NOT NULL,
    confirmation_prestataire BOOLEAN DEFAULT false,
    confirmation_magasin BOOLEAN DEFAULT false,
    date_demande_ramassage TIMESTAMP DEFAULT now(),
    date_confirmation_magasin TIMESTAMP,
    date_confirmation_prestataire TIMESTAMP
)

CREATE TABLE article_commande (
    commande_id INT NOT NULL,
    code_barre VARCHAR(255),
    quantite INT NOT NULL,
    prix_vente REAL NOT NULL,
    id_lieu_ramassage INT,
    CONSTRAINT fk_commande FOREIGN KEY (commande_id) REFERENCES commande(commande_id),
    CONSTRAINT fk_code_barre FOREIGN KEY (code_barre) REFERENCES article(code_barre),
    CONSTRAINT fk_lieu_ramassage FOREIGN KEY (id_lieu_ramassage) REFERENCES ramassage(id_lieu_ramassage)
)

CREATE INDEX index_date_ajout ON article(date_ajout) WHERE activé IS TRUE;
CREATE INDEX index_categorie ON article(marque,gender,division,silhouette);
CREATE INDEX index_taille_code_barre ON article_taille(code_barre, dimension);
CREATE INDEX index_taille_stock ON article_taille(stock_dimension);
CREATE INDEX index_commande_date_debut ON commande(date_debut);
CREATE INDEX index_commande_code_barre ON article_commande(code_barre);


