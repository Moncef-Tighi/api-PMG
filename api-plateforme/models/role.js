import db from "./database.js";


export const readRoles = async function() {
    const response = await db.query(`SELECT * FROM roles`);
    return response.rows;
}

export const createRole = async function(nom) {
    const sql = `INSERT INTO roles(nom_role) VALUES ($1) RETURNING *`;
    const values = [nom];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const deleteRole = async function(id_role) {

    const sql = `DELETE FROM roles WHERE id_role=$1 `;
    const values = [id_role];
    const response = await db.query(sql, values)
    return response.rows[0];

}

export const updateRole = async function(id_role, nom_role) {

    const sql = `UPDATE roles SET nom_role = $2 WHERE id_role=$1 RETURNING *`;
    const values = [id_role, nom_role];
    const response = await db.query(sql, values)
    return response.rows[0];

}