/****** Script for SelectTopNRows command from SSMS  ******/
SELECT 
GL_CODEARTICLE,
GL_DATECREATION,
GL_DATEPIECE,
DATEDIFF(minute,GL_DATECREATION,CURRENT_TIMESTAMP) AS 'Difference'

FROM [PMG2015].[dbo].[LIGNE]
WHERE year(CURRENT_TIMESTAMP)=year(GL_DATEPIECE) AND 
month(CURRENT_TIMESTAMP)=month(GL_DATEPIECE) AND
DAY(CURRENT_TIMESTAMP)=day(GL_DATEPIECE) AND
GL_NATUREPIECEG='FFO' AND GL_CODEARTICLE!='FD'
AND DATEDIFF(minute,GL_DATECREATION,CURRENT_TIMESTAMP)<30

