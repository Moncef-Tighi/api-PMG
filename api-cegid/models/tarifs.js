import db from "./database.js";
import Query from '../util/parametres.js';
import qs from "qs";

const query= new Query('-Gf_DATEMODIF');

export const tarifsArticles = async function(articles) {

    const sql = `
    SELECT DISTINCT
    GA_CODEARTICLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'prixActuel'
    ,GF_DATEMODIF    
    FROM GCTARFCONMODEART  
    WHERE (
        GF_REGIMEPRIX = 'TTC' AND (
            (GA_STATUTART='GEN' or GA_STATUTART='UNI')  
            AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')
            ) 
        AND GF_ARTICLE<>'') 
        AND GFM_NATURETYPE = 'VTE' 
    )
    ${query.where(qs.parse('GA_CODEARTICLE='+ articles.join('&GA_CODEARTICLE=')))}
    GROUP BY GA_CODEARTICLE
    ${query.sort()}`;

    const request = new db.Request()
    query.sanitize(request);
    const data = await request.query(sql);
    return data.recordset;

};


export const articleAllTarifs = async function(article) {

    const data = await db.query`
    SELECT DISTINCT
    GA_CODEARTICLE,GA_LIBELLE,ISNULL(GF_PRIXUNITAIRE, GA_PVTTC) as 'prixActuel', GA_PVTTC as 'prixInitial',
    GF_DATEMODIF, GF_LIBELLE, GF_DATEDEBUT, GF_DATEFIN
    GFM_TYPETARIF, GFM_PERTARIF, GFM_NATURETYPE,
    GA2_LIBREARTE
    
    FROM GCTARFCONMODEART  
    WHERE (
        GF_REGIMEPRIX = 'TTC' AND (
            (GA_STATUTART='GEN' or GA_STATUTART='UNI')  
            AND ( GFM_TYPETARIF IS NULL OR GFM_TYPETARIF IN ('','','001','RETAIL')
            ) 
        AND GF_ARTICLE<>'') 
        AND GFM_NATURETYPE = 'VTE' 
    )
    AND GA_CODEARTICLE = ${article}

    ORDER BY GF_DATEMODIF DESC 
    `
    return data.recordset;

}