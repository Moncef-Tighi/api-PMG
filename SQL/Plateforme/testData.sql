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