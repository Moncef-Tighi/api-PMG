import db from "./postGreSql.js";

//ATTENTION ! Il y a deux historiques :
//L'historique global, et l'historique pour chaque commande.
//Ici, c'est l'historique pour chaque commande.


export const createStatus = async function(id_status, id_commande, commentaire="") {
    const sql = `
        INSERT INTO status_commande(id_status, id_commande, commentaire)
        VALUES($1,$2,$3)
        RETURNING *
    `
    let values = [id_status, id_commande, commentaire];
    const response = await db.query(sql, values)
    return response.rows[0]
}


export const createHistorique = async function(id_commande, id_employe, type, description, commentaire="") {
    const sql = `
        INSERT INTO historique_commande(id_commande, id_employe, type, description, commentaire)
        VALUES($1,$2,$3,$4,$5)
        RETURNING *
    `
    let values = [id_commande, id_employe, type, description, commentaire];
    const response = await db.query(sql, values)

    return response.rows[0]
}

