import db from "./postGreSql.js";
import axios from 'axios';
import QueryPostGre from "../util/query.js";

export const checkDisponibilite = async function(articles) {
    const result = await axios.post(`${process.env.API_CEGID}/articles/disponible`, {
        articles,
    })
    return result.data.body;
}

export const readAllArticles = async function(param) {
    const query= new QueryPostGre("-date_ajout")

    if (param.code_article) {
        param["article.code_article"]=param.code_article;
        delete param.code_article;
    }
    const sql = `
        SELECT article.code_article,prix_initial, prix_vente, libelle, marque, gender,division, silhouette
        ,SUM(stock_dimension) as "stock", array_agg(dimension) as "dimension"  
        , date_ajout,date_modification, description, id_article_wooCommerce 
        FROM article 
        INNER JOIN article_taille ON article.code_article=article_taille.code_article
        ${query.where(param)}
        GROUP BY article.code_article, prix_vente, libelle
        ${query.sort(param)}
        ${query.paginate(param)}
        `

    const response = await db.query(sql, query.sanitize())
    return response.rows;

}

export const readArticles = async function(articles) {

    const sql = `
    SELECT article.code_article,prix_initial, prix_vente, libelle, array_agg(dimension) as "dimension", activé  FROM article 
    INNER JOIN article_taille ON article.code_article=article_taille.code_article
    WHERE article.code_article = ANY($1::varchar[])
    GROUP BY article.code_article, prix_vente, libelle
`
    const values = [articles];
    const response = await db.query(sql, values);
    return response.rows;
}

export const readOneArticle = async function(code_article) {
    const sql = `
        SELECT article.code_article,prix_initial, prix_vente, libelle, array_agg(dimension) as "dimension"  FROM article 
        INNER JOIN article_taille ON article.code_article=article_taille.code_article
        WHERE article.code_article = $1
        GROUP BY article.code_article, prix_vente, libelle
    `
    const values = [code_article];
    const response = await db.query(sql, values);
    return response.rows[0];

}

export const batchCreateArticles = async function(articles) {
    const data = await articles.map(async article=> {
        const data = await insertArticle(article.code_article, article.libelle, article.marque, article.date_modification,
            article.gender, article.division, article.silhouette, article.prix_initial, article.prix_vente,
            article.description, false);
        return data
    })
    return data;
}

export const insertArticle = async function(code_article, libelle=null, marque=null, date_modification=null,
    gender=null, division=null, silhouette=null ,prix_initial, prix_vente, description=null, activé=true){
    const sql = `
    INSERT INTO article(code_article, libelle, marque, gender, division, silhouette,
    date_modification, date_ajout,prix_initial, prix_vente, description, activé)
    VALUES 
    ($1, $2, $3, $4,$5, $6 , $7, CURRENT_TIMESTAMP,$8,$9,$10,$11 )
    ON CONFLICT (code_article) DO UPDATE
    SET libelle=$2,gender=$4, division=$5, silhouette=$6,
    date_modification=CURRENT_TIMESTAMP, prix_vente=$9, description=$10
    RETURNING *
    `

    const values = [code_article, libelle, marque,gender, division, silhouette
        , date_modification,prix_initial, prix_vente, description, activé];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const batchCreateTailles = async function(articles) {
    const data =  articles.map(async article=> {
        if (!article.tailles) throw "Impossible de trouver les tailles dans l'article : " + article.code_article
        const tailles = article.tailles;
        const data = await tailles.map(async taille=> {
            return await insertTaille(article.code_article, taille.dimension, taille.code_barre, taille.stock);
        })
        var articlesCreated = await Promise.all(data);
        return articlesCreated
    })
    return data
}

export const insertTaille = async function(code_article, dimension, code_barre, stock_dimension) {

    let disponible=false
    if (stock_dimension>process.env.MINSTOCK) disponible=true
    const sql = `
    INSERT INTO article_taille(code_article,dimension, code_barre, stock_dimension,disponible)
    VALUES
    ($1,$2,$3,$4,${disponible})
    ON CONFLICT (code_barre) DO UPDATE
    SET stock_dimension=$4, disponible=${disponible}
    RETURNING *
    `
    
    const values = [code_article, dimension, code_barre, Number(stock_dimension)];
    const response = await db.query(sql, values)
    return response.rows[0];

}

export const updatePrix = async function(code_article, prix) {

    const sql = `
    UPDATE article
    SET prix_vente=$1
    WHERE code_article=$2
    `

    const values = [prix, code_article];
    const response = await db.query(sql, values)

    return response.rowCount;

};

export const batchUpdateArticles = async function(articles) {
    const data = await articles.map(async article=> {
        const data = await updateArticle(article.code_article, article.libelle,
            article.gender, article.division, article.silhouette, article.prix_vente,
            article.description);
        return data
    })
    return data;
}

export const updateArticle = async function(code_article, libelle, gender="", division="", silhouette="", prix_vente, description="") {
    //Aucune idée de pourquoi cette fonction existe ou de quand je l'ai écris. En tout cas elle ne fonctionne pas actuellement
    const sqlArticle = `UPDATE article
    SET libelle=$2,gender=$3, division=$4, silhouette=$5,
    date_modification= CURRENT_TIMESTAMP , prix_vente=$6, description=$7
    WHERE code_article=$1
    RETURNING *`
    const values = [code_article, libelle, gender, division, silhouette, prix_vente, description];
    var responseArticle = await db.query(sqlArticle, values)
    return responseArticle.rows[0];
};

export const updateStockTaille = async function(tailles) {
    
    const sql= `
    UPDATE article_taille AS m SET 
	stock_dimension= a.stock_dimension,
	disponible=a.disponible
    FROM    (VALUES 
        ${tailles.map(taille => `('${taille.GA_CODEBARRE}',${taille.stockNet}, ${taille.stockNet > process.env.MINSTOCK ? true : false})`).join(',')}
            ) AS a(code_barre, stock_dimension, disponible)
    WHERE a.code_barre = m.code_barre
    RETURNING *
    `
    const response = await db.query(sql)
    return response.rows;

}

export const activationArticle = async function(code_article, activation) {
    //Fonction utilisée pour activer ET désactiver un article
    const sql = `
        UPDATE article SET activé=$2 
        WHERE code_article = ANY($1::varchar[])
        RETURNING *
    `
    const values = [code_article, activation];
    const response = await db.query(sql, values)

    return response.rows[0];
}


export const update_id_wooCommerce = async function(code_article, id) {
    const sql = `
    UPDATE article SET id_article_WooCommerce=$2 
    WHERE code_article = $1
    RETURNING *
    `
    const values = [code_article, id];
    const response = await db.query(sql, values)

    return response.rows[0];

}

export const update_id_taille_wooCommerce = async function(code_article,dimension, id) {
    const sql = `
    UPDATE article_taille SET id_taille_WooCommerce=$3 
    WHERE code_article = $1 AND dimension = $2
    RETURNING *
`
    const values = [code_article, dimension, id];
    const response = await db.query(sql, values)

    return response.rows[0];

}