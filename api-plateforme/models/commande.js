import db from "./postGreSql.js";
import axios from 'axios';
import QueryPostGre from "../util/query.js";


export const createCommande = async function({id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance}) {
 
    const sql= `
    INSERT INTO commande(id_prestataire, nom_client, prenom_client, numero_client,email_client,numero_commune,adresse,provenance )
    SELECT 
    $1,CAST($2 AS VARCHAR),CAST($3 AS VARCHAR),CAST($4 AS VARCHAR),$5,$6,$7,$8
    WHERE NOT EXISTS (select * from commande WHERE nom_client= $2 AND prenom_client= $3 AND numero_client= $4)
    RETURNING *

    `

    const values = [id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance];
    const response = await db.query(sql, values)
    return response.rows[0];

}