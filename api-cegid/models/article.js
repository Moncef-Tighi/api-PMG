import db from "./database.js";
import Query from '../util/parametres.js';


export const getAllArticles = async function(parametres) {
    const query= new Query('GA_CODEARTICLE');

    const sql = `SELECT
    GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
    GF_PRIXUNITAIRE, GF_QUALIFPRIX
    FROM ARTICLE
    INNER JOIN TARIF ON ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
    ${query.where(parametres)}
    ${query.sort(parametres)}
    ${query.paginate(parametres)}`;
    
    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return [data.recordset, data.rowsAffected];
};

export const disponibilitéArticle = async function(articles) {
    const data=await db.query`
    SELECT TOP 500
    GL_CODEARTICLE,
    SUM(GL_QTESTOCK) AS 'Stock Disponible'
    FROM [BNG].[dbo].[LIGNE]
    WHERE GL_CODEARTICLE IN ${articles.join(',')}
    GROUP BY GL_CODEARTICLE
    `;
    return data.recordset;
};

export const emplacementArticle = async function(produit) {
    // const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset;
};
