import db from "./postGreSql.js";
import QueryPostGre from "../util/query.js";

export const allEmploye = async function(param="", permissions="") {
    const query= new QueryPostGre("date_creation")

    const sql = `SELECT employé.id_employe,email, nom, prenom, poste, activé,
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    ${query.where(param)}
    GROUP BY employé.id_employe,email, nom, prenom, poste,activé
    ${permissions ? permissions : ""}
    ${query.sort(param)}
    ${query.paginate(param)}`;

    const values = query.sanitize();

    const response = await db.query(sql, values);
    return response.rows;

}

export const oneEmploye = async function(id) {
    const sql = `SELECT employé.id_employe,email, nom, prenom, poste, activé,
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    WHERE employé.id_employe= $1
    GROUP BY employé.id_employe,email, nom, prenom, poste,activé
    `;
    const values = [id];
    const response = await db.query(sql, values);

    return response.rows[0];

}

export const findEmployeId = async function(email) {
    const sql = ` SELECT id_employe FROM employé WHERE email= $1 `
    const values = [email];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const findEmploye = async function(id) {
    const sql = ` SELECT id_employe FROM employé WHERE id_employe= $1 `
    const values = [id];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const employeLogin = async function(email) {
    const sql = `SELECT employé.id_employe, password, email, nom, prenom, poste,
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    WHERE email= $1 AND activé=true
    GROUP BY employé.id_employe, password, email
    `;
    const values = [email];
    const response = await db.query(sql, values);
    return response.rows[0];
}

export const newEmploye = async function(email, password, nom, prenom="", poste=""){
    const sql = `
    INSERT INTO employé(email, password, nom, prenom, poste, date_creation)
    VALUES 
    ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP )
    RETURNING *
    `
    const values = [email, password, nom, prenom, poste];
    const response = await db.query(sql, values)
    return response.rows[0];
}

export const changeEmploye = async function(id,email,nom,prenom="",poste=""){
    const sql = `
    UPDATE employé 
    SET email=$2, nom=$3, prenom=$4, poste=$5
    WHERE id_employe=$1
    RETURNING *
    `
    const values = [id,email, nom, prenom, poste];
    const response = await db.query(sql, values)
    return response.rows[0];

}

export const changePassword = async function(id, password) {
    const sql = `UPDATE employé SET password= $2 WHERE id_employe=$1`;
    const values = [id, password];
    const response = await db.query(sql, values)
    return response.rows[0];

}

export const activationEmploye = async function(id, activation) {
    //Cette fonction est utilisé pour désactiver et réactiver les employés.
    const sql = `UPDATE employé SET activé= $2 WHERE id_employe=$1`;
    const values = [id, activation];
    const response = await db.query(sql, values)
    return response.rows[0];
}