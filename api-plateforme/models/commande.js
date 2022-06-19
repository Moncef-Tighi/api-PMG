import db from "./postGreSql.js";

export const createCommande = async function({id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance}) {
    db.query('BEGIN');
    try {
        let sql= `
        INSERT INTO commande(id_prestataire, nom_client, prenom_client, numero_client,email_client,numero_commune,adresse,provenance )
        VALUES  
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `
    
        let values = [id_prestataire,nom_client, prenom_client,numero_client,email_client,numero_commune,adresse,provenance];
        const response = await db.query(sql, values)

        const id_commande= response.rows[0].id_commande;
        if (!id_commande) {
            throw Error("La création de la commande a échouée")
        }
        sql = `INSERT INTO status_commande(id_status,id_commande, commentaire)
        VALUES (3,${id_commande}, 'Création de la commande commande')    
        `
        const status= await db.query(sql)
        db.query("COMMIT");
        return response.rows[0];
    } catch(error) {
        db.query("ROLLBACK");
        throw Error(error);
    }
}