import db from "./postGreSql.js";


export const ajoutPointRamassage = async function(id_article_commande,nom_magasin) {

    const sql = `
        INSERT INTO ramassage(id_article_commande,nom_magasin)
        VALUES($1,$2)
        RETURNING *
    `

    const values = [id_article_commande,nom_magasin];
    const response = await db.query(sql, values)
    return response.rows;
}






