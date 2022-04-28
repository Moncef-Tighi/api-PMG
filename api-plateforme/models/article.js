import db from "./database.js";

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