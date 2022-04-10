SELECT --TOP 1000
GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
GF_PRIXUNITAIRE, GF_QUALIFPRIX
FROM ARTICLE
INNER JOIN TARIF ON ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
--WHERE (GA_CODEARTICLE > @previousScore)
ORDER BY GA_CODEARTICLE
OFFSET 10 ROWS FETCH NEXT 1000 ROWS ONLY;


/*
    Requête avec le stock : Le problème c'est que cette requête est extrêmement lente
    Je crois que le problème c'est que code article n'est pas indexé dans Ligne
*/

-- SELECT TOP 500
--   GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
--   GF_PRIXUNITAIRE, GF_QUALIFPRIX,
--   GDI_LIBELLE AS 'Dimension',
--   SUM(GL_QTESTOCK) AS 'Stock Disponible'
-- FROM ARTICLE  
-- INNER JOIN TARIF ON ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
-- INNER JOIN LIGNE ON LiGNE.GL_CODEARTICLE = ARTICLE.GA_CODEARTICLE 
-- INNER JOIN DIMENSION ON ARTICLE.GA_CODEDIM1 = DIMENSION.GDI_CODEDIM OR GA_CODEDIM2  = DIMENSION.GDI_CODEDIM
--  --OR GA_CODEDIM3  = DIMENSION.GDI_CODEDIM OR GA_CODEDIM4  = DIMENSION.GDI_CODEDIM OR GA_CODEDIM5  = DIMENSION.GDI_CODEDIM
-- GROUP BY Ga_CODEARTICLE, GA_ARTICLE, GA_CODEBARRE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
--   GF_PRIXUNITAIRE, GF_QUALIFPRIX

SELECT TOP 500
  GA_CODEARTICLE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE, GA_PVTTC,
  MAX(GF_PRIXUNITAIRE),
  SUM(GL_QTESTOCK) AS 'Stock Disponible'
FROM ARTICLE  
LEFT JOIN TARIF ON TARIF.GF_ARTICLE LIKE GA_CODEARTICLE +'%'
INNER JOIN LIGNE ON LiGNE.GL_CODEARTICLE = ARTICLE.GA_CODEARTICLE 
GROUP BY Ga_CODEARTICLE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,GA_PVTTC,GA_DATECREATION
HAVING SUM(GL_QTESTOCK) > 0
ORDER BY GA_DATECREATION DESC



/*
  Dernière querry en date, elle est rapide
  Pour une raison inconnue quand j'enlève le join de la table Tarif tout va plus vite
  Requête minimale pour n'avoir qu'un résultat par code article.
  Si on ajoute la date ou les tailles ont obtient plusieurs réponse pour chaque code article 

*/
SELECT 5000
GA_CODEBARRE
,ISNULL( GDI_LIBELLE, 'Inconnue') AS 'Dimension'
,ISNULL( SUM(GL_QTESTOCK), 0) AS 'Stock Disponible'
FROM ARTICLE  
LEFT JOIN LIGNE ON LiGNE.GL_ARTICLE = ARTICLE.GA_ARTICLE 
LEFT JOIN DIMENSION ON ARTICLE.GA_CODEDIM1= DIMENSION.GDI_CODEDIM
--WHERE GA_CODEARTICLE= ${param}
GROUP BY Ga_CODEARTICLE, GA_DATECREATION, GA_CODEBARRE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,GA_PVTTC
,GDI_LIBELLE



/*
  -Au sujet de la table Tarif : 
  Il n'y a pas de codeArticle, juste Article. Il y a un ID tarif mais dans la table article cet attribut est toujours vide
  En faite article dans prix unitaire ça a de l'espace et un X à la fin mais pas de codeDim d'ou le fait qu'une querry
  qui combine Taille et Tarif ne va donner que les articles n'ayant pas de Dimension défini


  -Je sort par dateCréation parce que ça semble être le mieux pour la lisibilité

  -ça pourrait être bien de ne montrer que les articles qui ont au moins 1 de stock. Il y a 50000 articles total
  mais seulement 2500 en stock 
*/