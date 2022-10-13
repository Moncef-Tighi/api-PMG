SELECT wilaya,COUNT(wilaya) AS "Livraison perdue" FROM ventes
WHERE wilaya NOT IN (
'Alger', 'Blida', 'Tizi ouzou', 'Jijel' ,'Souk Ahras'
,'Boumerdes', 'Bouira' ,"M'sila", 'Guelma',
'Tipaza', 'Medea', 'Tlemcen', 'Laghouat',
'Ain defla', 'Bejaia', 'El Tarf',
'Chlef', 'Setif', 'Khenchela',
'Constantine', 'Batna',
'Skikda', 'Biskra',
'Oran', 'Tiaret','Mascara', 'Tebessa',
'Annaba', 'Djelfa','Sidi Bel abbes', 'ghardaia'
,'Aïn Témouchent', 'Bordj Bou Arreridj',
'Tissemsilt','Mostaganem','Oum El Bouaghi','relizane',''
)
GROUP BY wilaya
ORDER BY COUNT(wilaya) DESC;


-------------------


SELECT wilaya, AVG(frais_livraison) AS "Yalidine", AVG(new_frais_livraison) AS "Meslves" 
FROM ventes
WHERE new_frais_livraison>0 AND frais_livraison>0 
GROUP BY wilaya;


-------------------

SELECT SUM(frais_livraison) AS "Yalidine", SUM(new_frais_livraison) AS "Meslves" 
FROM ventes
WHERE new_frais_livraison>0 AND frais_livraison>0 

-------------------

SELECT wilaya, MAX(frais_livraison) AS "Yalidine", AVG(new_frais_livraison) AS "Meslves", COUNT(wilaya) AS "nombre_livraison" 
FROM ventes
WHERE new_frais_livraison>0 AND `dernier_statut`="Livré"
GROUP BY wilaya
ORDER BY COUNT(wilaya) DESC


