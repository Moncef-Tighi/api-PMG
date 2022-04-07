SELECT --TOP 1000
GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
GF_PRIXUNITAIRE, GF_QUALIFPRIX
FROM ARTICLE
INNER JOIN TARIF ON ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
--WHERE (GA_CODEARTICLE > @previousScore)
ORDER BY GA_CODEARTICLE
OFFSET 10 ROWS FETCH NEXT 1000 ROWS ONLY;