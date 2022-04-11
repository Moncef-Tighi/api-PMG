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
    SELECT DISTINCT TOP 200
    GA_CODEARTICLE, GA_FAMILLENIV1, GA_DATECREATION,GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'Prix Actuel', GA_PVTTC as 'Prix Initial',
    GF_DATEMODIF as 'Dernière date Tarif', GF_LIBELLE as 'Description Tarif', GF_DATEDEBUT, GF_DATEFIN
    GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
    GA2_LIBREARTE, 
    ISNULL((
        SELECT
        SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET
        FROM DISPO
        LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
        WHERE GA_CODEARTICLE=GCTARFCONMODEART.GA_CODEARTICLE
        GROUP BY
        GA_CODEARTICLE
    ),0) AS 'Stock'
    

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
    AND GF_DATEMODIF>'2021-01-01' 
    ${query.where(parametres, true)}
    ` 
    // ${query.sort(parametres)}
    // ${query.paginate(parametres)}
    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return [data.recordset, data.rowsAffected];
};

export const getArticle = async function(parametre) {
    // const data = await db.query`
    // SELECT
    // GA_CODEBARRE
    // ,ISNULL( GDI_LIBELLE, 'Inconnue') AS 'Dimension'
    // ,ISNULL( SUM(GL_QTESTOCK), 0) AS 'Stock Disponible'
    // FROM ARTICLE  
    // LEFT JOIN LIGNE ON LiGNE.GL_ARTICLE = ARTICLE.GA_ARTICLE 
    // LEFT JOIN DIMENSION ON ARTICLE.GA_CODEDIM1= DIMENSION.GDI_CODEDIM
    // WHERE GA_CODEARTICLE= ${param}
    // GROUP BY Ga_CODEARTICLE, GA_DATECREATION, GA_CODEBARRE,GA_FAMILLENIV1,GA_FAMILLENIV2,GA_LIBELLE,GA_PVTTC
    // ,GDI_LIBELLE
    // `;

    const data = await db.query`
    SELECT

    GA_CODEARTICLE, GA_LIBELLE, GA_CODEBARRE,
    GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE,
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) QTE_STOCK_NET

    FROM DISPO

    LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
    LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
        AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
        AND GDI1.GDI_TYPEDIM = 'DI1' 
    LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
        AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
        AND GDI2.GDI_TYPEDIM = 'DI2' 

    WHERE GA_CODEARTICLE=${parametre}
    GROUP BY
    GA_CODEARTICLE, GA_LIBELLE,
    GA_CODEBARRE,
    GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE
    `

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
