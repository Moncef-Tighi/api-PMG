INSERT INTO roles(nom_role) VALUES
('admin'),
('modification'),
('commmande_all'),
('commmande_alger'),
('commmande_setif'),
('commmande_oran');

INSERT INTO employé(email, password, nom, date_creation)
VALUES 
('admin', 'root' , 'admin',  CURRENT_TIMESTAMP );

INSERT INTO permissions(id_employe, id_role) VALUES
(1,1),
(1,2);