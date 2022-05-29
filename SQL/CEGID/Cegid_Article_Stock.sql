

SELECT
GDE_LIBELLE,
GA_CODEARTICLE,
GA_LIBELLE,
MAX(GA_FAMILLENIV1) AS GA_FAMILLENIV1,
MAX(GA_FAMILLENIV2) AS GA_FAMILLENIV2,


SUM(GQ_TRANSFERT) AS Qte_TRANSFERT,

SUM(GQ_LIVRECLIENT+GQ_VENTEFFO) QTE_VENDU,

SUM(GQ_LIVRECLIENT+GQ_VENTEFFO)/ NULLIF(SUM(GQ_TRANSFERT), 0) AS Ratio,

SUM(GQ_PHYSIQUE) AS Qte_Stock,

SUM(GQ_ECARTINV) AS GQ_ECARTINV

--SUM(GQ_DPRDOSSIER) AS GQ_DPRDOSSIER
FROM DISPO
LEFT JOIN ARTICLE ON GA_ARTICLE = GQ_ARTICLE
LEFT JOIN ARTICLECOMPL ON GA2_ARTICLE=GQ_ARTICLE
LEFT JOIN DEPOTS ON GQ_DEPOT = GDE_DEPOT
WHERE  GQ_DEPOT LIKE '%$P!{Store1}%'
AND GA_LIBREARTA LIKE '%$P!{Marque1}%'
AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' AND GQ_PHYSIQUE <> '0'

GROUP BY
GDE_LIBELLE,
GQ_CLOTURE,
GQ_DATECLOTURE,
GA_STATUTART,
GA_FERME,
GA_CODEARTICLE,
GA_LIBELLE
,GA_LIBCOMPL
,GA_TYPEARTICLE

 







--Nouvelle Version


SELECT
GDE_LIBELLE,
GQ_DEPOT,
GA_CODEBARRE,
--GA_CODEARTICLE,
GA_LIBELLE,
ISNULL(GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE) AS 'Dimension',
MAX(GA_FAMILLENIV1) AS GA_FAMILLENIV1,
MAX(GA_FAMILLENIV2) AS GA_FAMILLENIV2,


SUM(GQ_TRANSFERT) AS Qte_TRANSFERT,

SUM(GQ_LIVRECLIENT+GQ_VENTEFFO) QTE_VENDU,

--SUM(GQ_LIVRECLIENT+GQ_VENTEFFO)/ NULLIF(SUM(GQ_TRANSFERT), 0) AS Ratio,

SUM(GQ_PHYSIQUE) AS Qte_Stock,

SUM(GQ_ECARTINV) AS GQ_ECARTINV

--SUM(GQ_DPRDOSSIER) AS GQ_DPRDOSSIER
FROM DISPO
LEFT JOIN ARTICLE ON GA_ARTICLE = GQ_ARTICLE

LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
    AND GDI1.GDI_TYPEDIM = 'DI1' 
LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
    AND GDI2.GDI_TYPEDIM = 'DI2' 

INNER JOIN DEPOTS ON GQ_DEPOT = GDE_DEPOT
--WHERE  GQ_DEPOT LIKE '%$P!{Store1}%'
--AND GA_LIBREARTA LIKE '%$P!{Marque1}%'
AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'-- AND GQ_PHYSIQUE <> '0'
WHERE GA_CODEARTICLE = '1003171'
GROUP BY

GDE_LIBELLE, GDE_ABREGE,
GA_CODEBARRE,
GA_CODEARTICLE,
GA_LIBELLE,
GQ_DEPOT,
GDI1.GDI_LIBELLE, GDI2.GDI_LIBELLE
ORDER BY GDE_LIBELLE DESC









SELECT (GDE_LIBELLE) as C0, GA_CODEARTICLE, GA_LIBELLE, GA_FAMILLENIV1, YX1.YX_LIBELLE as C4, GA_FAMILLENIV2,
CC2.CC_LIBELLE as C6, YX3.YX_LIBELLE as C7, YX4.YX_LIBELLE as C8, GA_CODEBARRE, GA_CODEDIM1, GDI_LIBELLE, GA_CODEDIM2
GDE_DEPOT, GQ_PHYSIQUE, STOCKDISPO, GQ_RESERVETRF, GQ_RESERVECLI, (GQ_RESERVECLI - GQ_RESERVETRF) as C18, GQ_BROUILLONTRF,
GQ_PREPACLI, (GQ_PREPACLI - GQ_BROUILLONTRF) as C21, GQ_EMPLACEMENT, GQ_ARTICLE, GQ_CLOTURE, GA_STATUTART, GQ_DATECLOTURE,
GQ_DEPOT, GA2_LIBREARTE 
    
FROM DEPOTS,DISPODIM_MODES5  
LEFT OUTER JOIN CHOIXEXT YX1 ON GA_LIBREARTA=YX1.YX_CODE AND YX1.YX_TYPE="LAA"   
LEFT OUTER JOIN CHOIXCOD CC2 ON GA2_FAMILLENIV6=CC2.CC_CODE AND CC2.CC_TYPE="FN6"   
LEFT OUTER JOIN CHOIXEXT YX3 ON GA_LIBREART3=YX3.YX_CODE AND YX3.YX_TYPE="LA3"   
LEFT OUTER JOIN CHOIXEXT YX4 ON GA_LIBREART5=YX4.YX_CODE AND YX4.YX_TYPE="LA5"   
WHERE GQ_DEPOT=GDE_DEPOT AND ((GQ_DEPOT="054") AND (
    GDE_TYPEDEPOT="SAV" OR GDE_TYPEDEPOT="TD1" OR GDE_TYPEDEPOT="TD4" OR GDE_TYPEDEPOT="TD5" OR GDE_TYPEDEPOT="VEN") AND GQ_CLOTURE<>"X") 
ORDER BY GQ_DEPOT ,GA_CODEARTICLE ,GQ_CLOTURE ,GQ_PHYSIQUE