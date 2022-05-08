import db from "./postGreSql.js";

export const createAction = async function(id_employe, action_sur,categorie,type,description ){
    const sql = `
    INSERT INTO historique_actions(id_employe, action_sur, categorie, date_creation,type,description)
    VALUES 
    ($1, $2, $3, CURRENT_TIMESTAMP,$5, $4 )
    RETURNING *
    `
    const values = [id_employe, action_sur, categorie,type,description];
    const response = await db.query(sql, values)
    return response.rows[0];
}
