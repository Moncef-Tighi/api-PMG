import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";


const query= new Query('-GA_DATECREATION');

export const getAllArticles = async function(parametres) {
    const sql = `
    SELECT
    GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE, GA_PVHT , GA_PVTTC
    ,ISNULL( GDI_LIBELLE, 'Inconnue') AS 'Dimension'
    ,ISNULL( SUM(GL_QTESTOCK), 0) AS 'Stock Disponible'
    FROM ARTICLE  
    LEFT JOIN LIGNE ON LiGNE.GL_CODEARTICLE = ARTICLE.GA_CODEARTICLE 
    LEFT JOIN DIMENSION ON ARTICLE.GA_CODEDIM1= DIMENSION.GDI_CODEDIM
    ${query.where(parametres)}
    GROUP BY Ga_CODEARTICLE, GA_DATECREATION, GA_ARTICLE, GA_CODEBARRE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE, GA_PVHT , GA_PVTTC
    ,GDI_LIBELLE 
    ${query.sort(parametres)}
    ${query.paginate(parametres)}`;

    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return [data.recordset, data.rowsAffected];
};

export const disponibilitéArticle = async function(articles) {
    const sql = `
    SELECT
    GL_CODEARTICLE,
    SUM(GL_QTESTOCK) AS 'Stock Disponible'
    FROM LIGNE
    ${query.where(qs.parse('GL_CODEARTICLE='+ articles.join('&GL_CODEARTICLE=')))}
    GROUP BY GL_CODEARTICLE`;

    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return data.recordset
};

export const emplacementArticle = async function(produit) {
    // const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset;
};
