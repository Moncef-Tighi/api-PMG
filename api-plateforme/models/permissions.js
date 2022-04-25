import db from "./database.js";

export const findRoleId = async function(nom) {
    const sql = ` SELECT id_role FROM roles WHERE nom_role= $1 `
    const values = [nom];
    const response = await db.query(sql, values)
    return response.rows[0];

}