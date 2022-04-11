/* Création de la vue CONSULTSTOCK */ 
CREATE VIEW [dbo].[CONSULTSTOCK] AS SELECT
Article.ga_codearticle, Article.ga_libelle, Article.ga_article, Dispo.gq_physique, Dispo.gq_depot 
Article LEFT JOIN Dispo ON Article.ga_article = Dispo.gq_article WHERE Dispo.gq_cloture = '-' ;