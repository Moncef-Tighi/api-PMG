SELECT employé.id_employe, login, password, nom, prenom, poste, date_creation, 
nom_role FROM employé
INNER JOIN permissions ON permissions.id_employe=employé.id_employe
INNER JOIN roles ON roles.id_role = permissions.id_role