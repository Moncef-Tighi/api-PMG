import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";

const query= new Query('-MAX(GA_DATEMODIF)');

export const getAllArticles = async function(parametres,having={}, old=false) {
    
    if (parametres[" "]) delete parametres[" "]

    if (!old) parametres.GA_DATEMODIF=qs.parse("[gt]=2021")
    const sql = `
    SELECT DISTINCT
    GA_CODEARTICLE
    ,MAX(A.CC_LIBELLE) AS "marque"
    ,MAX(GA_LIBELLE) AS "GA_LIBELLE"
    ,"gender" =MAX(
    CASE    
        WHEN GA_LIBREART6=001 THEN 'Men'
        WHEN GA_LIBREART6=002 THEN 'Women'
        WHEN GA_LIBREART6=003 THEN 'Infant'
    END)
    ,"division"=MAX(
    CASE
        WHEN GA_FAMILLENIV2='APP' THEN 'Apparel'
        WHEN GA_FAMILLENIV2='FTW' THEN 'Footware'
        WHEN GA_FAMILLENIV2='EQU' THEN 'Equipment'
    END)
    , MAX(B.CC_LIBELLE) as "silhouette"
    , MAX(GA_PVTTC) AS "GA_PVTTC"
    ,SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stock'
    , MAX(GA_DATEMODIF) AS "GA_DATEMODIF"
    , [total]= COUNT(*) OVER()
                    
    FROM DISPO
    INNER JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
    LEFT JOIN CHOIXCOD  A ON A.CC_CODE=GA_FAMILLENIV1 AND A.CC_TYPE='FN1'
    LEFT JOIN CHOIXCOD AS B ON B.CC_CODE=GA_LIBREART4 AND B.CC_TYPE='FN4'
    ${query.where(parametres)} 
    GROUP BY GA_CODEARTICLE
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
    SELECT DISTINCT TOP 1
    GA_CODEARTICLE
    ,MAX(a.CC_LIBELLE) AS "marque"
    ,MAX(b.CC_LIBELLE) AS "type"
    ,MAX(GA_DATECREATION) AS 'GA_DATECREATION'
    ,MAX(GA_LIBELLE) AS 'GA_LIBELLE'
    ,GF_PRIXUNITAIRE as 'prixActuel'
    , MAX(GA_PVTTC) as 'prixInitial',
    MAX(GF_DATEMODIF) as 'dernierTarif'
    ,MAX(GF_LIBELLE) as 'descriptionTarif'
    ,MAX(GF_DATEDEBUT) as 'GF_DATEDEBUT'
    ,MAX(GF_DATEFIN)as 'GF_DATEFIN'
    ,MAX(GFM_TYPETARIF) as 'GFM_TYPETARIF'
    ,MAX(GFM_PERTARIF) as 'GFM_PERTARIF'
    ,MAX(GFM_NATURETYPE) as 'GFM_NATURETYPE'
    
    FROM ARTICLE 
    LEFT OUTER JOIN TARIF ON TARIF.GF_ARTICLE = ARTICLE.GA_ARTICLE
    LEFT OUTER JOIN TARIFMODE ON TARIF.GF_TARFMODE = TARIFMODE.GFM_TARFMODE 
    LEFT JOIN CHOIXCOD AS a ON a.CC_CODE=GA_FAMILLENIV1
    LEFT JOIN CHOIXCOD AS b ON b.CC_CODE=GA_FAMILLENIV2    
    WHERE 
    GA_CODEARTICLE = ${parametre} AND (
    (
        (GF_REGIMEPRIX = 'TTC' AND ((GA_STATUTART='GEN' or GA_STATUTART='UNI')  
        AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')) AND GF_ARTICLE<>'') AND GFM_NATURETYPE = 'VTE' ) 
        AND GF_DATEMODIF = ( 
            SELECT MAX(GF_DATEMODIF) FROM TARIF
            WHERE ARTICLE.GA_ARTICLE = TARIF.GF_ARTICLE
        )
    )
    OR GF_REGIMEPRIX IS NULL )
    
     GROUP BY GA_CODEARTICLE,GF_PRIXUNITAIRE, GA_PVTTC
     ORDER BY GF_PRIXUNITAIRE DESC`;
    return data.recordset;

}


export const dispoArticleTaille = async function(article, field='GA_CODEARTICLE') {

    //Attention ! Le code de cette query est complexe parce que parfois on veut avoir la disponibilité de l'article
    //Et parfois on veut la disponibilité d'une taille. Cette fonction donne les deux ! 

    const request = new db.Request();
    let sql = `
    SELECT
    GA_CODEARTICLE,
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
        AND GDI2.GDI_TYPEDIM = 'DI2' `

    if (Array.isArray(article)) {
        sql+= `${query.where(qs.parse(`${field}=`+ article.join(`&${field}=`)))}
            AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'
            GROUP BY
            GA_CODEARTICLE,
            GA_CODEBARRE,
            GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE
        `
        query.sanitize(request);
    } else {
        sql+= `WHERE ${field}='${article}' AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR'
        GROUP BY
        GA_CODEARTICLE,
        GA_CODEBARRE,
        GDI1.GDI_LIBELLE , GDI2.GDI_LIBELLE`
    }
    const data = await request.query(sql);

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

export const emplacementTaille = async function(code_barres) {

    const request = new db.Request();

    const sql= `

        SELECT
        GA_CODEBARRE AS "code_barre",
        GDE_LIBELLE AS "depot",
        SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI) AS 'stockNet'

        FROM DISPO

        LEFT JOIN ARTICLE ON GA_ARTICLE=GQ_ARTICLE
        INNER JOIN DEPOTS ON GQ_DEPOT= depots.GDE_DEPOT
        WHERE GA_CODEBARRE IN ('${code_barres.join("','")}') AND GQ_CLOTURE <> 'X' AND GA_TYPEARTICLE = 'MAR' 
        AND GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI>0
        
        GROUP BY GDE_LIBELLE, GA_CODEBARRE
    
    `
    const data = await request.query(sql);

    return data.recordset;

}


export const disponibilitéArticle = async function(articles) {

    if (typeof articles === 'string') articles = [articles]
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


export const latestTransactionCode = async function(minutes) {
    const data=await db.query `
        SELECT 
        GL_CODEARTICLE
        FROM LIGNE
        WHERE GL_NATUREPIECEG='FFO' AND GL_CODEARTICLE!='FD'
        AND DATEDIFF(minute,GL_DATECREATION,CURRENT_TIMESTAMP)<${minutes}
        `;

    return data.recordset;

}