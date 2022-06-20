/*
    Cette requête est utilisée pour chercher les duplications dans les commandes
    On return l'information sous forme de JSON plus précisément array d'objets
    Parce qu'après c'est plus facile de chercher si la nouvelle commande est identique à une commande existante
*/

SELECT article_commande.id_commande
,JSON_AGG(json_build_object('code_barre', code_barre,'quantité',quantite)) AS "articles"
FROM article_commande
INNER JOIN commande ON commande.id_commande = article_commande.id_commande
INNER JOIN status_commande ON commande.id_commande = status_commande.id_commande
--La liste de chiffres c'est la liste de status qui indique qu'une commande est terminée
--Parce que c'est possible qu'un client renvoi une commande qui a été annulée ou pour un échange
WHERE id_status NOT IN (2,10,11,12) AND (
email_client='moncef@gmail.com' OR (nom_client LIKE 'Tighiouart' AND prenom_client LIKE 'Moncef'))

GROUP BY article_commande.id_commande