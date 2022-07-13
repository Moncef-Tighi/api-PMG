
SELECT code_barre, quantite, prix_vente
,COALESCE(nom_magasin, 'Aucun Magasin choisi') as "Magasin"
,confirmation_prestataire, confirmation_magasin, COALESCE(date_demande_ramassage::text, 'Non Ramassée') as "date_demande_ramassage"

FROM article_commande
LEFT OUTER JOIN ramassage ON ramassage.id_lieu_ramassage = article_commande.id_lieu_ramassage
WHERE id_commande= 5
