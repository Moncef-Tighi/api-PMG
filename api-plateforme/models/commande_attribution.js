import db from "./postGreSql.js";


export const getCommandeAttribution = async function(id) {
    const sql = `
        SELECT commande.id_commande, id_employe, date_attribution, id_status  FROM commande
        LEFT OUTER JOIN commande_attribution ON commande_attribution.id_commande = commande.id_commande
        LEFT OUTER JOIN status_commande ON status_commande.id_commande = commande.id_commande
        WHERE commande.id_commande = ${id} AND date_attribution = 
		(SELECT MAX(date_attribution) FROM commande_attribution
		WHERE commande.id_commande = ${id})
    `
    const response = await db.query(sql)
    return response.rows[0];
}

export const attributeCommande = async function(id_commande, id_employe) {
    const sql = `
        INSERT INTO commande_attribution(id_commande,id_employe)
        VALUES (${id_commande}, ${id_employe})
        RETURNING *
    `
    const response = await db.query(sql)
    return response.rows[0];

}