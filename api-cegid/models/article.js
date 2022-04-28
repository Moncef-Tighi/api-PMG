import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";

const query= new Query('-GA_DATEMODIF');

export const getAllArticles = async function(parametres,having={}) {
    

    const sql = `
    SELECT DISTINCT
    GA_CODEARTICLE, 
    MAX(a.CC_LIBELLE) AS "marque",MAX(b.CC_LIBELLE) AS "type"
    , MAX(GA_LIBELLE) AS "GA_LIBELLE"
    , MAX(GA_PVTTC) AS 'GA_PVTTC'
    ,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
    , MAX(GA_DATECREATION) as "GA_DATECREATION", MAX(GA_DATEMODIF) as "GA_DATEMODIF"
    , [total]= COUNT(*) OVER()
        
    FROM DISPO
    INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
    LEFT JOIN CHOIXCOD AS a ON a.CC_CODE=GA_FAMILLENIV1
    LEFT JOIN CHOIXCOD AS b ON b.CC_CODE=GA_FAMILLENIV2    
    ${query.where(parametres)} 
    GROUP BY Ga_CODEARTICLE
    ${query.having(having)}
    ${query.sort(parametres)}
    ${query.paginate(parametres)}
    `

    const request = new db.Request();
    query.sanitize(request);
    const data = await request.query(sql);
    return [data.recordset, data.rowsAffected];

};

export const infoArticle = async function(parametre) {

    const data = await db.query `
    SELECT DISTINCT
    a.CC_LIBELLE AS "marque",b.CC_LIBELLE AS "type",
    GA_DATECREATION,GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'prixActuel', GA_PVTTC as 'prixInitial',
    GF_DATEMODIF as 'dernierTarif', GF_LIBELLE as 'descriptionTarif', GF_DATEDEBUT, GF_DATEFIN,
    GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
    GA2_LIBREARTE

    FROM GCTARFCONMODEART  
    LEFT JOIN CHOIXCOD AS a ON a.CC_CODE=GA_FAMILLENIV1
    LEFT JOIN CHOIXCOD AS b ON b.CC_CODE=GA_FAMILLENIV2    
    WHERE 
    (GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
                        AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') 
    AND GFM_NATURETYPE = 'VTE' )
    AND GF_DATEMODIF = ( 
        SELECT MAX(GF_DATEMODIF) FROM TARIF
        WHERE GCTARFCONMODEART.GA_ARTICLE = TARIF.GF_ARTICLE
    )
    AND GA_CODEARTICLE = ${parametre}`;
    return data.recordset;

}


export const dispoArticleTaille = async function(article) {

    const data = await db.query`
    SELECT
    
    GA_CODEBARRE,
    ISNULL(GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE) AS 'dimension',
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stockNet'

    FROM DISPO

    LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
    LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
        AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
        AND GDI1.GDI_TYPEDIM = 'DI1' 
    LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
        AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
        AND GDI2.GDI_TYPEDIM = 'DI2' 

    WHERE GA_CODEARTICLE=${article} AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'
    GROUP BY
    GA_CODEBARRE,
    GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE`

    return data.recordset

}

export const emplacementArticle = async function(article) {

    const data=await db.query`
    SELECT
    GDE_LIBELLE,
    GQ_DEPOT,
    ISNULL(GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE) AS 'dimension',
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stockNet'
    
    FROM DISPO
    LEFT JOIN ARTICLE ON GA_ARTICLE = GQ_ARTICLE

    LEFT OUTER JOIN DIMENSION AS GDI1 ON ARTICLE.GA_GRILLEDIM1 = GDI1.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM1 = GDI1.GDI_CODEDIM 
    AND GDI1.GDI_TYPEDIM = 'DI1' 
    LEFT OUTER JOIN DIMENSION AS GDI2 ON ARTICLE.GA_GRILLEDIM2 = GDI2.GDI_GRILLEDIM 
    AND ARTICLE.GA_CODEDIM2 = GDI2.GDI_CODEDIM 
    AND GDI2.GDI_TYPEDIM = 'DI2' 
    
    INNER JOIN DEPOTS ON GQ_DEPOT = GDE_DEPOT
    AND GA_TYPEARTICLE = 'MAR' AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'

    WHERE GA_CODEARTICLE = ${article}
    
    GROUP BY
    GDE_LIBELLE, GDE_ABREGE,
    GQ_DEPOT,
    GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE
    
    ORDER BY GDE_LIBELLE DESC`;

    return data.recordset;
    
};

export const disponibilitéArticle = async function(articles) {

    if (typeof articles === 'string') articles = [articles]
    console.log(articles);
    const sql = `
    SELECT
    GA_CODEARTICLE,
    SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stockNet'
    FROM DISPO
    LEFT JOIN ARTICLE ON GA_ARTICLE = GQ_ARTICLE
    ${query.where(qs.parse('GA_CODEARTICLE='+ articles.join('&GA_CODEARTICLE=')))}
    GROUP BY GA_CODEARTICLE`;

    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return data.recordset;

};