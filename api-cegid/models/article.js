import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";


const query= new Query('GA_CODEARTICLE');

export const getAllArticles = async function(parametres) {
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
    try {
        const data = await request.query(sql);
        return [data.recordset, data.rowsAffected];
    } catch(error) {
        throw error;
    }
};

export const disponibilitéArticle = async function(articles) {
    const sql = `SELECT
    GL_CODEARTICLE,
    SUM(GL_QTESTOCK) AS 'Stock Disponible'
    FROM [BNG].[dbo].[LIGNE]
    ${query.where(qs.parse('GL_CODEARTICLE='+ articles.join('&GL_CODEARTICLE=')))}
    GROUP BY GL_CODEARTICLE`;

    const request = new db.Request()
    query.sanitize(request);
    try {
        const data = await request.query(sql);
        const dataRecord = data.recordset
        let resultat = {};
        articles.forEach(article => {
            //Ce code est complexe parce que le return de la query peut être soit : Undefined, un objet ou un array d'objet
            if (!dataRecord) return resultat[article] = 0;
            if (dataRecord instanceof Array) {
                dataRecord.forEach(code => {
                    if (article===code.GL_CODEARTICLE) return resultat[article] =  code['Stock Disponible']
                })
            }
            else {
                if (article===dataRecord?.GL_CODEARTICLE) return resultat[article] =  data.recordset[0].GL_CODEARTICLE
            }
            if (!(article in resultat)) return resultat[article] = 0;
        });
        return resultat
    } catch(error) {
        throw error;
    }

};

export const emplacementArticle = async function(produit) {
    // const data=await db.query`SELECT * FROM produit WHERE nom_produit=${produit}`;
    return data.recordset;
};
