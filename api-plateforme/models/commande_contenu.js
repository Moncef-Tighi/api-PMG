import db from "./postGreSql.js";

export const contenuUneCommande = async function(id_commande) {
    const sql = `
    SELECT code_barre, quantite, prix_vente
    ,COALESCE(nom_lieu_ramassage, 'Aucun Magasin choisi') as "Magasin"
    ,confirmation_prestataire, confirmation_magasin, COALESCE(date_demande_ramassage::text, 'Non Ramassée') as "date_demande_ramassage"
    
    FROM article_commande
    LEFT OUTER JOIN ramassage ON ramassage.id_lieu_ramassage = article_commande.id_lieu_ramassage
    WHERE id_commande= ${id_commande}
    `
    const response = await db.query(sql)
    return response.rows;
}

export const arrayOfCommandeForOneClient = async function(email) {

    const sql=`
    SELECT article_commande.id_commande
    ,JSON_AGG(json_build_object('code_barre', code_barre,'quantité',quantite)) AS "articles"
    FROM article_commande
    INNER JOIN commande ON commande.id_commande = article_commande.id_commande
    INNER JOIN status_commande ON commande.id_commande = status_commande.id_commande
    WHERE id_status NOT IN (2,10,11,12) AND (
        email_client=$1
    )
    GROUP BY article_commande.id_commande
    `

    const values = [email];
    const response = await db.query(sql, values)
    return response.rows;

}

export const addArticleToCommand = async function(id_commande, code_barre, quantité, prix_vente) {

    await db.query("BEGIN");
    const sql= `
    INSERT INTO article_commande(id_commande, code_barre, quantite, prix_vente)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `
    await db.query("COMMIT")
    const values = [id_commande, code_barre, quantité, prix_vente];
    const response = await db.query(sql, values)
    return response.rows;
}

export const updateQuantiteCommande = async function(id_commande, code_barre, quantité) {
 
    const sql= `
    UPDATE article_commande
    SET quantite=$3
    WHERE id_commande = $1 AND code_barre = $2
    RETURNING *
    `
    
    const values = [id_commande, code_barre, quantité];
    const response = await db.query(sql, values);
    return response.rows;
}


export const removeArticleCommande = async function() {

}