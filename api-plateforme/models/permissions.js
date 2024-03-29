import db from "./postGreSql.js";

export const findRoleId = async function(nom) {
    const sql = ` SELECT id_role FROM roles WHERE nom_role= $1 `
    const values = [nom];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const findRole = async function(id) {
    const sql = ` SELECT id_role FROM roles WHERE id_role= $1 `
    const values = [id];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const addPermission = async function(id_employe, id_role) {
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