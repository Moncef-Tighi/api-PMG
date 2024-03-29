SELECT GF_FERME, GDE1.GDE_LIBELLE as C1, GF_DEPOT, GA_TARIFARTICLE, 
GFM_TYPETARIF, GFM_PERTARIF, GF_DATEDEBUT, GF_DATEFIN, GF_ARTICLE, 
GA_CODEARTICLE, GA_PVTTC, GF_PRIXUNITAIRE, GF_CALCULREMISE, GF_DEVISE,
 GA_FAMILLENIV1, YX2.YX_LIBELLE as C14, GF_TARIF, GF_TARFMODE, GF_DATEMODIF,
 GA2_LIBREARTE, GA_LIBELLE 
 FROM GCTARFCONMODEART  
 LEFT OUTER JOIN DEPOTS GDE1 ON GF_DEPOT=GDE1.GDE_DEPOT 
 LEFT OUTER JOIN CHOIXEXT YX2 ON GA_LIBREARTA=YX2.YX_CODE 
    AND YX2.YX_TYPE='LAA'   WHERE (GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
    AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
    AND (GFM_PERTARIF='BFP'  or GFM_PERTARIF='DAM'  or GFM_PERTARIF='DST'  or GFM_PERTARIF='EMS' 
    or GFM_PERTARIF='FOU'  or GFM_PERTARIF='H16'  or GFM_PERTARIF='H17'  or GFM_PERTARIF='H18' 
    or GFM_PERTARIF='H19'  or GFM_PERTARIF='H20'  or GFM_PERTARIF='H21'  or GFM_PERTARIF='J22' 
    or GFM_PERTARIF='KID'  or GFM_PERTARIF='LEV'  or GFM_PERTARIF='NOS'  or GFM_PERTARIF='OPM' 
    or GFM_PERTARIF='OUVR'  or GFM_PERTARIF='PBF'  or GFM_PERTARIF='PCOV'  or GFM_PERTARIF='PDIM' 
    or GFM_PERTARIF='PER'  or GFM_PERTARIF='PFW'  or GFM_PERTARIF='PLV'  or GFM_PERTARIF='PMG'  
    or GFM_PERTARIF='POW'  or GFM_PERTARIF='PPMG'  or GFM_PERTARIF='PRMW'  or GFM_PERTARIF='PRX'  
    or GFM_PERTARIF='PS19'  or GFM_PERTARIF='PTIM'  or GFM_PERTARIF='R19'  or GFM_PERTARIF='RMD' 
    or GFM_PERTARIF='RUSA'  or GFM_PERTARIF='S17'  or GFM_PERTARIF='SCOV'  or GFM_PERTARIF='SEL'
    or GFM_PERTARIF='SHDD'  or GFM_PERTARIF='SNIKE'  or GFM_PERTARIF='SOLDE'  or GFM_PERTARIF='SP21'
    or GFM_PERTARIF='SS18'  or GFM_PERTARIF='SS19'  or GFM_PERTARIF='SS20'  or GFM_PERTARIF='SS21'
    or GFM_PERTARIF='SS21P'  or GFM_PERTARIF='UMB'  or GFM_PERTARIF='WD2'  or GFM_PERTARIF='WEV'
    or GFM_PERTARIF='WHSL' ) AND GFM_NATURETYPE = 'VTE' )  
ORDER BY GF_DATEMODIF DESC

