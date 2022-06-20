import db from "./postGreSql.js";

export const contenuUneCommande = async function(id_commande) {
    const sql = `
    SELECT code_barre, quantite, prix_vente
    ,COALESCE(nom_lieu_ramassage, 'Aucun Magasin choisi')
    ,confirmation_prestataire, confirmation_magasin, date_demande_ramassage
    
    FROM article_commande
    LEFT OUTER JOIN ramassage ON ramassage.id_lieu_ramassage = article_commande.id_lieu_ramassage
    WHERE id_commande= ${id_commande}
    `
    const response = await db.query(sql)
    return response.rows;
}

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