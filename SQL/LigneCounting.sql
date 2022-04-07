SELECT TOP 500
	GL_CODEARTICLE,
	GL_LIBELLE,
	GL_REFARTBARRE,
	SUM(GL_QTESTOCK) AS 'Stock Disponible'
  FROM [BNG].[dbo].[LIGNE]
  WHERE GL_CODEARTICLE='00501-2739' 
  GROUP BY GL_LIBELLE,GL_CODEARTICLE,GL_REFARTBARRE


--La même requête avec juste le code et le stock
  SELECT TOP 500
	GL_CODEARTICLE,
	SUM(GL_QTESTOCK) AS 'Stock Disponible'
  FROM [BNG].[dbo].[LIGNE]
  WHERE GL_CODEARTICLE='00501-2739' 
  GROUP BY GL_CODEARTICLE