import db from "./postGreSql.js";
import QueryPostGre from "../util/query.js";

//ATTENTION ! Il y a deux historiques :
//L'historique global, et l'historique pour chaque commande.
//Ici, c'est l'historique pour chaque commande.


export const OneHistorique= async function(id_commande, page) {
    const query= new QueryPostGre("-date_action")

    const sql = `
        SELECT nom,prenom, date_action, type, description, commentaire FROM historique_commande
        LEFT OUTER JOIN employee ON historique_commande.id_employe=employee.id_employe
        WHERE id_commande=$1
        ${query.sort()}
        ${query.paginate({sort: true, page, pagesize : 2})}
    `

    const response = await db.query(sql, [id_commande])
    return response.rows

}


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

