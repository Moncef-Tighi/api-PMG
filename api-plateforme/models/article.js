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
        SELECT article.code_article,prix_initial, prix_vente, libelle, array_agg(dimension) as "dimension"  
        , date_ajout, marque, description
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

export const insertArticle = async function(code_article, libelle=null, marque=null, date_modification=null,prix_initial, prix_vente, description=null){
    const sql = `
    INSERT INTO article(code_article, libelle, marque, date_modification, date_ajout,prix_initial, prix_vente, description)
    VALUES 
    ($1, $2, $3, $4, CURRENT_TIMESTAMP,$5,$6,$7 )
    ON CONFLICT (code_article) DO UPDATE
    SET libelle=$2, prix_vente=$6, description=$7
    RETURNING *
    `
    const values = [code_article, libelle, marque, date_modification,prix_initial, prix_vente, description];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const insertTaille = async function(code_article, dimension, code_barre, stock_dimension) {

    let disponible=false
    if (stock_dimension>process.env.MINSTOCK) disponible=true
    const sql = `
    INSERT INTO article_taille(code_article,dimension, code_barre, stock_dimension,disponible)
    VALUES
    ($1,$2,$3,$4,${disponible})
    `

    const values = [code_article, dimension, code_barre, stock_dimension];
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

export const updateArticle = async function(article, tailles) {
    try {
        await db.query("BEGIN");
        const sqlArticle = `UPDATE article
        SET prix_vente=$1, libelle=$2, description=$3`
        const values = [prix, code_article];
        var responseArticle = await db.query(sql, values)
    

    } catch(error) {
        await client.query('ROLLBACK')
        throw error
    }
};

export const activationArticle = async function(code_article, activation) {
    //Fonction utilisée pour activer ET désactiver un article
    const sql = `
        UPDATE article SET activé=$2 
        WHERE code_article=$1
        RETURNING *
    `
    const values = [code_article, activation];
    const response = await db.query(sql, values)
    return response.rows[0];
}