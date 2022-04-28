import db from "./database.js";
import axios from 'axios';

export const checkDisponibilite = async function(articles) {
    const result = await axios.post(`${process.env.API_CEGID}/articles/disponible`, {
        articles,
    })
    return result.data.body;
}

export const readAllArticles = async function() {
    const sql = `
        SELECT article.code_article, prix_vente, libelle, array_agg(dimension) as "dimension"  FROM article 
        INNER JOIN article_taille ON article.code_article=article_taille.code_article
        GROUP BY article.code_article, prix_vente, libelle
    `

    const response = await db.query(sql)
    return response.rows;

}

export const readArticles = async function(articles) {

    const sql = `
    SELECT article.code_article, prix_vente, libelle, array_agg(dimension) as "dimension", activé  FROM article 
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
        SELECT article.code_article, prix_vente, libelle, array_agg(dimension) as "dimension"  FROM article 
        INNER JOIN article_taille ON article.code_article=article_taille.code_article
        WHERE article.code_article = $1
        GROUP BY article.code_article, prix_vente, libelle
    `
    const values = [code_article];
    const response = await db.query(sql, values);
    return response.rows[0];

}

export const insertArticle = async function(code_article, libelle=null, marque=null, type=null, date_creation=null, prix_vente, description=null, tags=null){
    const sql = `
    INSERT INTO article(code_article, libelle, marque, type, date_creation, date_ajout, prix_vente, description, tags)
    VALUES 
    ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP,$6,$7,$8 )
    RETURNING *
    `
    const values = [code_article, libelle, marque, type, date_creation, prix_vente, description, tags];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const insertTaille = async function(code_article, dimension, code_barre) {

    const sql = `
    INSERT INTO article_taille(code_article,dimension, code_barre)
    VALUES
    ($1,$2,$3)
    `

    const values = [code_article, dimension, code_barre];
    const response = await db.query(sql, values)
    return response.rows[0];

}

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