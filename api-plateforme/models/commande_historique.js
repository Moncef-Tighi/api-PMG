import db from "./postGreSql.js";

export const createHistorique = async function(id_commande, id_employe, type, description, commentaire="") {
    const sql = `
        INSERT INTO historique_commande(id_commande, id_employe, type, description, commentaire)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `
    let values = [id_commande, id_employe, type, description, commentaire];
    const response = await db.query(sql, values)

    return response.rows
}