import db from "./database.js";

export const findRoleId = async function(nom) {
    const sql = ` SELECT id_role FROM roles WHERE nom_role= $1 `
    const values = [nom];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const addRole = async function(id_employe, id_role) {
    const sql = `INSERT INTO permissions(id_employe,id_role) VALUES ($1,$2)`;
    const values = [id_employe,  id_role];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const deletePermission = async function(id_employe, id_role) {

    const sql = `DELETE FROM permissions WHERE id_employe=$1 AND id_role=$2 `;
    const values = [id_employe,  id_role];
    const response = await db.query(sql, values)
    return response.rows[0];

}