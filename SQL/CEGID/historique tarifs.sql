SELECT DISTINCT
GA_CODEARTICLE,GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'Prix Actuel', GA_PVTTC as 'Prix Initial',
GF_DATEMODIF, GF_LIBELLE as 'Description Tarif', GF_DATEDEBUT, GF_DATEFIN
GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
GA2_LIBREARTE

FROM GCTARFCONMODEART  
WHERE (
	GF_REGIMEPRIX = 'TTC' AND (
		(GA_STATUTART='GEN' or GA_STATUTART='UNI')  
		AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) 
		AND GF_ARTICLE<>''
		) 
	AND GFM_NATURETYPE = 'VTE' 
)
AND GA_CODEARTICLE = '875695-400'

ORDER BY GF_DATEMODIF DESC 