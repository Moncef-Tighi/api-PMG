SELECT

GQ_DEPOT,

GQ_CLOTURE,

GQ_DATECLOTURE,

GA_STATUTART,

GA_FERME,

GA_PVHT,

GA_PVTTC,

GA_PAHT,

GA_PRHT,

GA_CODEBARRE,

GA_ARTICLE,

GA_CODEARTICLE,

GA_LIBELLE,

GA_LIBCOMPL,

GA_TYPEARTICLE,

GA_POIDSVARIABLE,

GA_UNITEQTEVTE,

GQ_EMPLACEMENT,

MAX(GA_COMMENTAIRE) AS GA_COMMENTAIRE,

MAX(GA_COLLECTION) AS GA_COLLECTION,

MAX(GA_FAMILLENIV1) AS GA_FAMILLENIV1,

MAX(GA_FAMILLENIV2) AS GA_FAMILLENIV2,

MAX(GA_FAMILLENIV3) AS GA_FAMILLENIV3,

MAX(GA2_COLLECTIONBAS) AS GA2_COLLECTIONBAS,

MAX(GA2_FAMILLENIV4) AS GA2_FAMILLENIV4,

MAX(GA2_FAMILLENIV5) AS GA2_FAMILLENIV5,

MAX(GA2_FAMILLENIV6) AS GA2_FAMILLENIV6,

MAX(GA2_FAMILLENIV7) AS GA2_FAMILLENIV7,

MAX(GA2_FAMILLENIV8) AS GA2_FAMILLENIV8,

MAX(GA2_STATART1) AS GA2_STATART1,

MAX(GA2_STATART2) AS GA2_STATART2,

MAX(GQ_DEVISE) AS GQ_DEVISE,

SUM(MIL_PHYSIQUE) AS MIL_PHYSIQUE,

SUM(GQ_STOCKMIN) AS GQ_STOCKMIN,

SUM(GQ_STOCKMAX) AS GQ_STOCKMAX,

SUM(GQ_LIVREFOU) AS GQ_LIVREFOU,

SUM(GQ_TRANSFERT) AS GQ_TRANSFERT,

SUM(GQ_ENTREESORTIES) AS GQ_ENTREESORTIES,

SUM(GQ_BROUILLONBEX) AS GQ_BROUILLONBEX,

SUM(GQ_BROUILLONBSX) AS GQ_BROUILLONBSX,

SUM(GQ_PHYSIQUE) AS GQ_PHYSIQUE,

SUM(GQ_RESERVECLI) AS GQ_RESERVECLI,

SUM(GQ_RESERVEFOU) AS GQ_RESERVEFOU,

SUM(GQ_PREPACLI) AS GQ_PREPACLI,

SUM(GQ_PREPAORLI) AS GQ_PREPAORLI,

SUM(GQ_AVOIRFOURNSTOCK) AS GQ_AVOIRFOURNSTOCK,

SUM(GQ_AVOIRSTOCK) AS GQ_AVOIRSTOCK,

SUM(GQ_ECARTINV) AS GQ_ECARTINV,

SUM(GQ_FACTURECLI) AS GQ_FACTURECLI,

SUM(GQ_FACTUREFOU) AS GQ_FACTUREFOU,

SUM(GQ_BROUILLONBRF) AS GQ_BROUILLONBRF,

SUM(GQ_RETOURFOURN) AS GQ_RETOURFOURN,

SUM(GQ_LIVRECLIENT) AS GQ_LIVRECLIENT,

SUM(GQ_VENTEFFO) AS GQ_VENTEFFO,

SUM(GQ_LIVRECLIENT+GQ_VENTEFFO) QTE_VENDU,

SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET,

MAX(GA_POIDSBRUT) AS GA_POIDSBRUT,

MAX(GA_POIDSNET) AS GA_POIDSNET,

MAX(GA_QUALIFPOIDS) AS GA_QUALIFPOIDS,

SUM(GQ_DPRDOSSIER) AS GQ_DPRDOSSIER,

SUM(GQ_PMRPDOSSIER) AS GQ_PMRPDOSSIER,

SUM(GQ_PANIERWEB) AS GQ_PANIERWEB

FROM DISPO

LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE

LEFT JOIN ARTICLECOMPL ON GA2_ARTICLE=GQ_ARTICLE

LEFT JOIN MDISPOIMAGELIG ON GQ_DEPOT=MIL_DEPOT AND GQ_ARTICLE=MIL_ARTICLE

GROUP BY GQ_DEPOT,GQ_CLOTURE,GQ_DATECLOTURE,
GA_STATUTART,GA_FERME,GA_CODEARTICLE,GA_LIBELLE,GA_LIBCOMPL,GA_TYPEARTICLE,GQ_EMPLACEMENT