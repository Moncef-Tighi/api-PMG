import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";


const query= new Query('-GA_DATECREATION');

export const getAllArticles = async function(parametres) {

    // const sql = `
    // SELECT
    // GA_CODEARTICLE, GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE, GA_PVTTC
    // ,SUM(GL_QTESTOCK) AS 'Stock'
    // FROM ARTICLE  
    // LEFT JOIN LIGNE ON LiGNE.GL_CODEARTICLE = ARTICLE.GA_CODEARTICLE 
    // ${query.where(parametres)}
    // GROUP BY GA_CODEARTICLE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,GA_PVTTC,GA_DATECREATION
    // HAVING SUM(GL_QTESTOCK) > 0
    // ${query.sort(parametres)}
    // ${query.paginate(parametres)}
    //`

    const sql = `
    SELECT DISTINCT TOP 500
    GA_CODEARTICLE, GA_FAMILLENIV1, GA_DATECREATION,GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'Prix Actuel', GA_PVTTC as 'Prix Initial',
    GF_DATEMODIF as 'Dernière date Tarif', GF_LIBELLE as 'Description Tarif', GF_DATEDEBUT, GF_DATEFIN
    GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
    GA2_LIBREARTE

    FROM GCTARFCONMODEART  
    WHERE 
    (GF_REGIMEPRIX = 'TTC' 
        AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
        AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
        AND GFM_NATURETYPE = 'VTE' 
    )
    AND GF_DATEMODIF = ( 
        SELECT MAX(GF_DATEMODIF) FROM TARIF
        WHERE GCTARFCONMODEART.GA_ARTICLE = TARIF.GF_ARTICLE
    )
    ${query.where(params, true)}
    ` 
    // ${query.sort(params)}
    // ${query.paginate(params)}

    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return [data.recordset, data.rowsAffected];
};

export const getArticle = async function(param) {
    const data = await db.query`
    SELECT
    GA_CODEBARRE
    ,ISNULL( GDI_LIBELLE, 'Inconnue') AS 'Dimension'
    ,ISNULL( SUM(GL_QTESTOCK), 0) AS 'Stock Disponible'
    FROM ARTICLE  
    LEFT JOIN LIGNE ON LiGNE.GL_ARTICLE = ARTICLE.GA_ARTICLE 
    LEFT JOIN DIMENSION ON ARTICLE.GA_CODEDIM1= DIMENSION.GDI_CODEDIM
    WHERE GA_CODEARTICLE= ${param}
    GROUP BY Ga_CODEARTICLE, GA_DATECREATION, GA_CODEBARRE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,GA_PVTTC
    ,GDI_LIBELLE
    `;
    return data.recordset
}


// export const getTarifs = async function(articles) {
//     console.log(articles.join(','));
//     const data = await db.query`
//     SELECT 
//     GF_PRIXUNITAIRE
//     FROM TARIF
//     WHERE TARIF.GF_ARTICLE in (${articles.join(',')})
//     `
//     return data.recordset;
// }

 
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
