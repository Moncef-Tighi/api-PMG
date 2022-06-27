import db from "./postGreSql.js";
import QueryPostGre from "../util/query.js";

export const listeCommandes = async function(param) {
    const query= new QueryPostGre("-commande_date_debut")
    if (param.id_status) {
        param["status_commande.id_status"]=param.id_status;
        delete param.id_status;
    }
    const sql = `
        SELECT commande.id_commande, prenom_client,nom_client,numero_client,email_client
        ,status_commande.id_status,status
        ,commande_date_debut,commande_date_fin,provenance
        ,nom_commune,nom_daira,nom_wilaya,adresse
        ,nom_prestataire
        ,COALESCE(id_employe::text, 'Non Attribué') as "attribué à"
        FROM commande
        INNER JOIN prestataire ON prestataire.id_prestataire = commande.id_prestataire
        
        INNER JOIN commune ON commune.numero_commune = commande.numero_commune
        LEFT JOIN daira ON daira.numero_daira = commune.numero_commune
        LEFT JOIN wilaya ON wilaya.numero_wilaya = daira.numero_daira
        
        INNER JOIN status_commande ON status_commande.id_commande= commande.id_commande AND status_date= 
            (SELECT MAX(status_date) FROM status_commande
            WHERE id_commande = commande.id_commande) 

        INNER JOIN liste_status_commande ON liste_status_commande.id_status = status_commande.id_status
        
        LEFT JOIN commande_attribution ON commande.id_commande = commande_attribution.id_commande
    
        ${query.where(param)}
        ${query.sort(param)}
        ${query.paginate(param)}
    `

    const response = await db.query(sql, query.sanitize())

    return response.rows;

}

export const createCommande = async function({id_prestataire,nom_client, prenom_client,numero_client
    ,email_client,numero_commune,adresse,provenance}) {
    db.query('BEGIN');
    try {
        let sql= `
        INSERT INTO commande(id_prestataire, nom_client, prenom_client, numero_client,email_client,numero_commune,adresse,provenance )
        VALUES  
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `
    
        let values = [id_prestataire,nom_client, prenom_client,numero_client,
            email_client,numero_commune,adresse,provenance];
        const response = await db.query(sql, values)

        const id_commande= response.rows[0].id_commande;
        if (!id_commande) {
            throw Error("La création de la commande a échouée")
        }
        sql = `INSERT INTO status_commande(id_status,id_commande, commentaire)
        VALUES (3,${id_commande}, 'Création de la commande')    
        `
        const status= await db.query(sql)
        db.query("COMMIT");
        return response.rows[0];
    } catch(error) {
        db.query("ROLLBACK");
        throw Error(error);
    }
}

export const updateCommande = async function({id_prestataire,nom_client, prenom_client,numero_client
    ,email_client,numero_commune,adresse, id_commande}) {
    const sql= `
    UPDATE commande
    SET id_prestataire=$1, nom_client=$2, prenom_client=$3, numero_client=$4,email_client=$5,numero_commune=$6,adresse=$7 )
    WHERE id_commande = $8
    
    RETURNING *
    `

    const values = [id_prestataire,nom_client, prenom_client,numero_client,
        email_client,numero_commune,adresse, id_commande];
    const response = await db.query(sql, values)

    return response.rows[0];
}
