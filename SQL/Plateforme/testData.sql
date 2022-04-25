INSERT INTO roles(nom_role) VALUES
('admin'),
('modification'),
('commmande_all'),
('commmande_alger'),
('commmande_setif'),
('commmande_oran');

INSERT INTO employé(login, password, salt, nom, date_creation)
VALUES 
('admin', 'root' , 'xyé144frn' , 'admin',  CURRENT_TIMESTAMP );

INSERT INTO permissions(id_employe, id_role) VALUES
(1,1),
(1,2);