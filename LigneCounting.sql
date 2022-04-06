SELECT TOP 1000
    GL_ARTICLE,
	GL_CODEARTICLE,
	GL_LIBELLE,
	GL_FOURNISSEUR,
	GL_REFARTBARRE,
	COUNT(GL_CODEARTICLE) AS 'Stock Disponible'
FROM LIGNE
WHERE GL_CODEARTICLE='AH7268-107' AND GL_TENUESTOCK='X'
GROUP BY GL_LIBELLE,GL_ARTICLE,GL_CODEARTICLE,GL_FOURNISSEUR,GL_REFARTBARRE