INSERT INTO roles(nom_role) VALUES
('admin'),
('modification'),
('community'),
('commmande_all'),
('commmande_alger'),
('commmande_setif'),
('commmande_oran');

INSERT INTO employee(email, password, nom, date_creation)
VALUES 
('admin', '$2b$10$tEbxTV47jJT2tWWGa/XFWep/dsOBbRtgOsqPLzkCxAgxZ6JH5GvbG' , 'admin',  CURRENT_TIMESTAMP );

--Attention ! L'insertions des permissions peut changer si il y a eu des insertions avant sur la base de donnée
--et que donc les chiffres actuellement spécifiée ne sont pas correct

INSERT INTO permissions(id_employe, id_role) VALUES
(1,1),
(1,2);

INSERT INTO wilaya(numero_wilaya, nom_wilaya) 
VALUES 
(16, 'Alger'),
(2, 'Chlef');

INSERT INTO daira(numero_daira, numero_wilaya,nom_daira) 
VALUES
(1, 16,'Bab El Oued'),
(2, 16,'Baraki'),
(3, 2, 'Abou El Hassan'),
(4,2, 'El Karimia');

INSERT INTO commune(numero_commune, numero_daira, nom_commune)
VALUES
(1,1,'Bab El-Oued'),
(2,1,'Casbah'),
(3,1,'Bologhine'),

(4,2,'Baraki'),
(5,2,'Les Eucalyptus'),
(6,2,'Sidi Moussa'),

(7,3,'Baraki'),
(8,3,'Les Eucalyptus'),
(9,3,'Sidi Moussa'),


(10,4,'Abou El Hassan'),
(11,4,'Talassa'),
(12,4,'Tadjena'),

(13,4,'El Karimia'),
(14,4,'Harchoun'),
(15,4,'Beni Bouateb');


-- Les status d'une commande sont statiques

INSERT INTO liste_status_commande(id_status, status)
VALUES

(1,'Nouvelle Commande'),
(2,'En attente de confirmation'),
(3,'Confimée'),
(4,'En Attente des magasins'),
(5,'En cours de packaging'),
(6,'En cours de ramassage'),
(7,'En cours de livraison'),
(8,'Echange'),
(9,'Annulée'),
(10,'Echouée'),
(11,'Réussie');

INSERT INTO prestataire(id_prestataire, nom_prestataire, url_api)
VALUES
(1, 'yalidine', 'https://www.yalidine.com/api/v1');