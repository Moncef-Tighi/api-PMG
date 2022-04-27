import db from "./database.js";

export const insertArticle = async function(code_article, libelle=null, FamilleNiv1=null, FamilleNiv2=null, date_creation, prix_vente, description=null, tags=null){
    const sql = `
    INSERT INTO article(code_article, libelle, FamilleNiv1, FamilleNiv2, date_creation, date_ajout, prix_vente, description, tags)
    VALUES 
    ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP,$6,$7,$8 )
    RETURNING *
    `
    const values = [code_article, libelle, FamilleNiv1, FamilleNiv2, date_creation, prix_vente, description, tags];
    const response = await db.query(sql, values)
    return response.rows[0];
}