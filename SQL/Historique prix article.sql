SELECT DISTINCT
GA_CODEARTICLE, GA_FAMILLENIV1, GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'Prix Actuel', GA_PVTTC as 'Prix Initial',
MAX(GF_DATEMODIF) as 'Date modif Tarif', GF_LIBELLE as 'Description Tarif', GF_DATEDEBUT, GF_DATEFIN
GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
GA2_LIBREARTE

FROM GCTARFCONMODEART  
WHERE 
(GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
					AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
AND GFM_NATURETYPE = 'VTE' )
AND GA_CODEARTICLE = '00501-2346'

GROUP BY GA_CODEARTICLE, GA_FAMILLENIV1, GA_LIBELLE,GF_PRIXUNITAIRE, GA_PVTTC
,GF_LIBELLE, GF_DATEDEBUT, GF_DATEFIN
,GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
GA2_LIBREARTE
ORDER BY MAX(GF_DATEMODIF) DESC