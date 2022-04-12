SELECT

GA_CODEARTICLE,
GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE-- ,GDI3.GDI_LIBELLE ,GDI4.GDI_LIBELLE ,GDI5.GDI_LIBELLE ,

SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET

FROM DISPO

LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
    AND GDI1.GDI_TYPEDIM = 'DI1' 
LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
    AND GDI2.GDI_TYPEDIM = 'DI2' 
-- LEFT OUTER JOIN DIMENSION AS GDI3 ON ARTICLE.GA_GRILLEDIM3 = GDI3.GDI_GRILLEDIM 
--     AND ARTICLE.GA_CODEDIM3 = GDI3.GDI_CODEDIM 
--     AND GDI3.GDI_TYPEDIM = 'DI3' 
-- LEFT OUTER JOIN DIMENSION AS GDI4 ON ARTICLE.GA_GRILLEDIM4 = GDI4.GDI_GRILLEDIM 
--     AND ARTICLE.GA_CODEDIM4 = GDI4.GDI_CODEDIM 
--     AND GDI4.GDI_TYPEDIM = 'DI4'
-- LEFT OUTER JOIN DIMENSION AS GDI5 ON ARTICLE.GA_GRILLEDIM5 = GDI5.GDI_GRILLEDIM
--   AND ARTICLE.GA_CODEDIM5 = GDI5.GDI_CODEDIM 
--   AND GDI5.GDI_TYPEDIM = 'DI5' 

WHERE GA_CODEARTICLE='00501-0115'
GROUP BY
GA_CODEARTICLE,
GA_CODEBARRE,
GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE-- ,GDI3.GDI_LIBELLE ,GDI4.GDI_LIBELLE ,GDI5.GDI_LIBELLE








SELECT TOP 1000

GA_CODEARTICLE,
ISNULL(GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE) AS 'Dimension',

SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'Stock Net',
SUM(GQ_TRANSFERT) AS 'Transfert',
SUM(GQ_LIVRECLIENT+GQ_VENTEFFO) AS 'Vendu',
SUM(GQ_PHYSIQUE) AS 'Stock',
SUM(GQ_ECARTINV) AS 'Ecart Inventaire'

FROM DISPO

LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
    AND GDI1.GDI_TYPEDIM = 'DI1' 
LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
    AND GDI2.GDI_TYPEDIM = 'DI2' 

WHERE GA_CODEARTICLE='314568-001' AND GA_TYPEARTICLE = 'MAR'
GROUP BY
GA_CODEARTICLE,
GA_CODEBARRE,
GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE