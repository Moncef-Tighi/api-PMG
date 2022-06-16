import db from "./postGreSql.js";
import axios from 'axios';
import QueryPostGre from "../util/query.js";


export const createCommande = async function({id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance}) {
 
    const sql= `INSERT INTO commande(id_prestataire, nom_client, prenom_client, numero_client,email_client,numero_commune,adresse,provenance )
    VALUES 
    ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `

    const values = [id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance];
    const response = await db.query(sql, values)
    return response.rows[0];

}