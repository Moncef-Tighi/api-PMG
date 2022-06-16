import db from "./postGreSql.js";
import axios from 'axios';
import QueryPostGre from "../util/query.js";


export const createCommande = async function({id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance}) {
    db.query('BEGIN');
    try {
        let sql= `
        INSERT INTO commande(id_prestataire, nom_client, prenom_client, numero_client,email_client,numero_commune,adresse,provenance )
        SELECT 
        $1,CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),CAST($4 AS VARCHAR),$5,$6,$7,$8
        WHERE NOT EXISTS (select * from commande WHERE nom_client= $2 AND prenom_client= $3 AND numero_client= $4)
        RETURNING *
        `
    
        let values = [id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance];
        const response = await db.query(sql, values)
        console.log(response.rows[0]);
        const id_commande= response.rows[0].id_commande;
        if (!id_commande) {
            throw Error("La création de la commande a échouée")
        }
        sql = `INSERT INTO status_commandes VALUES(id_commande, commentaire)
        VALUES (${id_commande}, 'Création de la nouvelle commande')    
        `
        const status= await db.query(sql)
        db.query("COMMIT");
        return response.rows[0];
    } catch(error) {
        db.query("ROLLBACK");
        throw Error(error);
    }
}