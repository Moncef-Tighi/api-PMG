import db from "./postGreSql.js";

export const addArticleToCommand = async function(id_commande, code_barre, quantité, prix_vente) {
 
    const sql= `
    INSERT INTO article_commande(id_commande, code_barre, quantite, prix_vente)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `
    
    const values = [id_commande, code_barre, quantité, prix_vente];
    const response = await db.query(sql, values)
    return response.rows;
}