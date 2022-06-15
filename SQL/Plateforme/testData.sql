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

INSERT INTO permissions(id_employe, id_role) VALUES
(1,1),
(1,2);

CREATE TABLE wilaya (
    numero_wilaya INT PRIMARY KEY,
    nom_wilaya VARCHAR(50)
);

INSERT INTO wilaya(numero_wilaya, nom_wilaya) 
VALUES 
(16, 'Alger'),
(2, 'Chlef')


CREATE TABLE daira (
    numero_daira INT PRIMARY KEY,
    numero_wilaya INT NOT NULL,
    nom_daira VARCHAR(50),
    CONSTRAINT fk_wilaya FOREIGN KEY (numero_wilaya) REFERENCES wilaya(numero_wilaya)
);

INSERT INTO daira(numero_daira, numero_wilaya,nom_daira) 
VALUES
(1, 16,'Bab El Oued'),
(2, 16,'Baraki'),
(3, 2, 'Abou El Hassan'),
(4,2, 'El Karimia')

CREATE TABLE baladia (
    numero_baladia INT PRIMARY KEY,
    numero_daira INT NOT NULL,
    nom_baladia VARCHAR(50),
    CONSTRAINT fk_daira FOREIGN KEY (numero_daira) REFERENCES daira(numero_daira)
);

INSERT INTO baladia(numero_baladia, numero_daira, nom_baladia)
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


(7,4,'Abou El Hassan'),
(8,4,'Talassa'),
(9,4,'Tadjena'),

(7,5,'El Karimia'),
(8,5,'Harchoun'),
(9,5,'Beni Bouateb'),