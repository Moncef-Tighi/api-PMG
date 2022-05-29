
-- Requête sans le dernier tarif.
SELECT DISTINCT
GA_CODEARTICLE, 
MAX(CC_LIBELLE) AS "marque",MAX(GA_FAMILLENIV2) AS "Division"
, MAX(GA_LIBELLE) AS "GA_LIBELLE"
, MAX(GA_PVTTC) AS 'GA_PVTTC'
,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
, MAX(GA_DATECREATION) as "GA_DATECREATION", MAX(GA_DATEMODIF) as "GA_DATEMODIF"
, [total]= COUNT(*) OVER()
    
FROM DISPO
INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
LEFT JOIN CHOIXCOD ON CC_CODE=GA_FAMILLENIV1  AND CC_LIBELLE!='Reprise grilles de dimension' 
GROUP BY GA_CODEARTICLE


-- Requête sans le dernier tarif.
SELECT DISTINCT
GA_CODEARTICLE, 
MAX(CC_LIBELLE) AS "marque"
,MAX(GA_FAMILLENIV2) AS "division"
, MAX(GA_LIBELLE) AS "GA_LIBELLE"
, MAX(GA_PVTTC) AS 'GA_PVTTC'
,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
, MAX(GA_DATECREATION) as "GA_DATECREATION", MAX(GA_DATEMODIF) as "GA_DATEMODIF"
, [total]= COUNT(*) OVER()
    
FROM DISPO
INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
LEFT JOIN CHOIXCOD ON CC_CODE=GA_FAMILLENIV1
GROUP BY GA_CODEARTICLE



--Requête avec le dernier tarif


SELECT TOP 1000
GA_CODEARTICLE, 
MAX(a.CC_LIBELLE) AS "marque",MAX(b.CC_LIBELLE) AS "type"
, MAX(GA_LIBELLE) AS "GA_LIBELLE"
, MAX(GA_PVTTC) AS "prixOriginal"
, MAX(GF_PRIXUNITAIRE) AS "prixActuel"
--,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
,ISNULL((
    SELECT
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET
    FROM DISPO
    LEFT JOIN ARTICLE AS "ARTICLE2"ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
    WHERE ARTICLE2.GA_CODEARTICLE=ARTICLE.GA_CODEARTICLE
    GROUP BY
    GA_CODEARTICLE
),0) AS 'Stock'
        
, MAX(GA_DATECREATION) as "GA_DATECREATION", MAX(GA_DATEMODIF) as "GA_DATEMODIF"
, [total]= COUNT(*) OVER()
FROM TARIF
LEFT OUTER JOIN TARIFMODE ON TARIF.GF_TARFMODE = TARIFMODE.GFM_TARFMODE 
LEFT OUTER JOIN ARTICLE ON GA_ARTICLE=GF_ARTICLE
--LEFT JOIN DISPO ON GQ_ARTICLE = GA_ARTICLE  AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
LEFT JOIN CHOIXCOD AS a ON a.CC_CODE=GA_FAMILLENIV1
LEFT JOIN CHOIXCOD AS b ON b.CC_CODE=GA_FAMILLENIV2
WHERE 
    (GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
                        AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
    AND GFM_NATURETYPE = 'VTE' )
    AND GF_DATEMODIF = ( 
        SELECT MAX(GF_DATEMODIF) FROM TARIF
        WHERE GA_ARTICLE = TARIF.GF_ARTICLE
    )


GROUP BY GA_CODEARTICLE
ORDER BY stock DESC











-- Requête problématique :
-- 1) Impossible de querry le stock
-- 2) Nombre bizarre d'articles (40000 au lieu de 2300)
-- 3) querry lente
set statistics time on
SELECT DISTINCT
GA_CODEARTICLE 
,MAX(a.CC_LIBELLE) AS "marque",MAX(b.CC_LIBELLE) AS "type"
, MAX(GA_LIBELLE) AS "GA_LIBELLE"
, MAX(GA_PVTTC) AS "prixOriginal"
, MAX(GF_PRIXUNITAIRE) AS "prixActuel"
,ISNULL((
    SELECT
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET
    FROM DISPO
    LEFT JOIN ARTICLE AS "ARTICLE2"ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'  
    WHERE ARTICLE2.GA_CODEARTICLE=ARTICLE.GA_CODEARTICLE
    GROUP BY GA_CODEARTICLE
),0) AS 'stock'

, MAX(GA_DATECREATION) as "GA_DATECREATION", MAX(GA_DATEMODIF) as "GA_DATEMODIF"
, [total]= COUNT(*) OVER()
FROM TARIF
LEFT OUTER JOIN TARIFMODE ON TARIF.GF_TARFMODE = TARIFMODE.GFM_TARFMODE 
LEFT OUTER JOIN ARTICLE ON GA_ARTICLE=GF_ARTICLE
LEFT JOIN CHOIXCOD AS a ON a.CC_CODE=GA_FAMILLENIV1
LEFT JOIN CHOIXCOD AS b ON b.CC_CODE=GA_FAMILLENIV2
WHERE 
    (GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
                        AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
    AND GFM_NATURETYPE = 'VTE' )
    AND GF_DATEMODIF = ( 
        SELECT MAX(GF_DATEMODIF) FROM TARIF
        WHERE GA_ARTICLE = TARIF.GF_ARTICLE
)
${query.where(parametres)} 
GROUP BY GA_CODEARTICLE
${query.having(having)}
${query.sort(parametres)}
${query.paginate(parametres)}



SELECT DISTINCT TOP 1000
GA_CODEARTICLE
,MAX(A.CC_LIBELLE) AS "marque"
,"gender" = MAX(
CASE    
	WHEN GA_LIBREART6=001 THEN 'Man'
    WHEN GA_LIBREART6=002 THEN 'Woman'
    WHEN GA_LIBREART6=003 THEN 'Infant'
END)
,"division"= MAX(
CASE
	WHEN GA_FAMILLENIV2='APP' THEN 'Apparel'
    WHEN GA_FAMILLENIV2='FTW' THEN 'Footware'
    WHEN GA_FAMILLENIV2='EQU' THEN 'Equipment'
END)
, MAX(B.CC_LIBELLE) as "silhouette"
, MAX(GA_PVTTC) as "GA_PVTTC"
,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
, MAX(GA_DATEMODIF) AS "GA_DATEMODIF"
        
FROM DISPO
INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
LEFT JOIN CHOIXCOD AS A ON A.CC_CODE=GA_FAMILLENIV1 AND CC_LIBELLE<>'Reprise grilles de dimension'
LEFT JOIN CHOIXCOD AS B ON B.CC_CODE=GA_LIBREART4
WHERE GA_CODEARTICLE LIKE '%M20326%'
GROUP BY Ga_CODEARTICLE
order by GA_CODEARTICLE











SELECT TOP 1000
GA_CODEARTICLE
,MAX(A.CC_LIBELLE) AS "marque"
,MAX(GA_LIBELLE) AS "GA_LIBELLE"
,"gender" =MAX(
CASE    
    WHEN GA_LIBREART6=001 THEN 'Men'
    WHEN GA_LIBREART6=002 THEN 'Women'
    WHEN GA_LIBREART6=003 THEN 'Infant'
END)
,"division"=MAX(
CASE
    WHEN GA_FAMILLENIV2='APP' THEN 'Apparel'
    WHEN GA_FAMILLENIV2='FTW' THEN 'Footware'
    WHEN GA_FAMILLENIV2='EQU' THEN 'Equipment'
END)
, MAX(B.CC_LIBELLE) as "silhouette"
, MAX(GA_PVTTC) AS "GA_PVTTC"
,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
, MAX(GA_DATEMODIF) AS "GA_DATEMODIF"
                
FROM DISPO
INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
INNER JOIN CHOIXCOD  A ON A.CC_CODE=GA_FAMILLENIV1 AND A.CC_TYPE='FN1'
LEFT JOIN CHOIXCOD AS B ON B.CC_CODE=GA_LIBREART4 AND B.CC_TYPE='FN4'
WHERE GA_DATEMODIF> '2021'
GROUP BY GA_CODEARTICLE




SELECT TOP 1000
ARTICLE.GA_CODEARTICLE
,MAX(A.CC_LIBELLE) AS "marque"
,MAX(DISPODIM_MODES5.GA_LIBELLE) AS "GA_LIBELLE"
,"gender" =MAX(
CASE    
    WHEN DISPODIM_MODES5.GA_LIBREART6=001 THEN 'Men'
    WHEN DISPODIM_MODES5.GA_LIBREART6=002 THEN 'Women'
    WHEN DISPODIM_MODES5.GA_LIBREART6=003 THEN 'Infant'
END)
,"division"=MAX(
CASE
    WHEN DISPODIM_MODES5.GA_FAMILLENIV2='APP' THEN 'Apparel'
    WHEN DISPODIM_MODES5.GA_FAMILLENIV2='FTW' THEN 'Footware'
    WHEN DISPODIM_MODES5.GA_FAMILLENIV2='EQU' THEN 'Equipment'
END)
, MAX(B.CC_LIBELLE) as "silhouette"
, MAX(GA_PVTTC) AS "GA_PVTTC"
,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
, MAX(GA_DATEMODIF) AS "GA_DATEMODIF"
    
FROM DEPOTS,DISPODIM_MODES5  
LEFT OUTER JOIN CHOIXEXT YX1 ON GA_LIBREARTA=YX1.YX_CODE AND YX1.YX_TYPE='LAA'   
LEFT OUTER JOIN CHOIXCOD CC2 ON GA2_FAMILLENIV6=CC2.CC_CODE AND CC2.CC_TYPE='FN6'   
LEFT OUTER JOIN CHOIXEXT YX3 ON GA_LIBREART3=YX3.YX_CODE AND YX3.YX_TYPE='LA3'   
LEFT OUTER JOIN CHOIXEXT YX4 ON GA_LIBREART5=YX4.YX_CODE AND YX4.YX_TYPE='LA5'  
INNER JOIN ARTICLE ON ARTICLE.GA_CODEARTICLE = DISPODIM_MODES5.GA_CODEARTICLE 
INNER JOIN CHOIXCOD  A ON A.CC_CODE=DISPODIM_MODES5.GA_FAMILLENIV1 AND A.CC_TYPE='FN1'
LEFT JOIN CHOIXCOD AS B ON B.CC_CODE=DISPODIM_MODES5.GA_LIBREART4 AND B.CC_TYPE='FN4'

WHERE GQ_DEPOT=GDE_DEPOT AND ((
    GDE_TYPEDEPOT='SAV' OR GDE_TYPEDEPOT='TD1' OR GDE_TYPEDEPOT='TD4' OR GDE_TYPEDEPOT='TD5' OR GDE_TYPEDEPOT='VEN') AND GQ_CLOTURE<>'X') 
    AND GA_DATEMODIF> '2021'
GROUP BY ARTICLE.GA_CODEARTICLE 