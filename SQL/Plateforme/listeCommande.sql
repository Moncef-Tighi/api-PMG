

SELECT commande.id_commande, prenom_client,nom_client,numero_client,email_client
,status_commande.id_status,status
,commande_date_debut,commande_date_fin,provenance
,nom_commune,nom_daira,nom_wilaya,adresse
,nom_prestataire
,COALESCE(id_employe::text, 'Non Attribué') as "attribué à"
FROM commande
INNER JOIN prestataire ON prestataire.id_prestataire = commande.id_prestataire

INNER JOIN commune ON commune.numero_commune = commande.numero_commune
LEFT JOIN daira ON daira.numero_daira = commune.numero_commune
LEFT JOIN wilaya ON wilaya.numero_wilaya = daira.numero_daira

INNER JOIN status_commande ON status_commande.id_commande= commande.id_commande
INNER JOIN liste_status_commande ON liste_status_commande.id_status = status_commande.id_status

LEFT JOIN commande_attribution ON commande.id_commande = commande_attribution.id_commande
