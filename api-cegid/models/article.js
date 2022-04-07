import db from "./database.js";
import Query from '../util/parametres.js';


export const getAllArticles = async function(paramtres) {
    const query= new Query('GA_CODEARTICLE');

    const sql = 
    `SELECT
    GA_ARTICLE,GA_CODEARTICLE,GA_CODEBARRE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,
    GF_PRIXUNITAIRE, GF_QUALIFPRIX
    FROM ARTICLE
    INNER JOIN TARIF ON ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
    ${query.where(paramtres)}
    ${query.sort(paramtres)}
    ${query.paginate(paramtres)}
    `;
    const request = new db.Request()
    query.sanitize(request);
    console.log(request);
    const data = await request.query(sql);
    console.log(request);
    return [data.recordset, data.rowsAffected];
};

export const vérifierDisponibilitéArticle = async function() {
    //const data=await db.query`SELECT * FROM produit WHERE stock>=5`;
    return data.recordset;
};

export const emplacementArticle = async function(produit) {
    // const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset;
};
