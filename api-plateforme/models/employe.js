import db from "./database.js";


export const allEmploye = async function() {
    const response = await db.query(`SELECT employé.id_employe,email, nom, prenom, poste, 
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    GROUP BY employé.id_employe,email, nom, prenom, poste`);
    return response.rows;

}

export const oneEmploye = async function(id) {
    const sql = `SELECT employé.id_employe,email, nom, prenom, poste, 
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    WHERE employé.id_employe= $1
    GROUP BY employé.id_employe,email, nom, prenom, poste
    `;
    const values = [id];
    const response = await db.query(sql, values)

    return response.rows[0];

}

export const employeLogin = async function(email) {
    const sql = `SELECT employé.id_employe, password, email,
    array_agg(nom_role) as "permissions" FROM employé
    INNER JOIN permissions ON employé.id_employe = permissions.id_employe
    INNER JOIN roles ON permissions.id_role = roles.id_role
    WHERE email= $1
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

export const findEmployeId = async function(email) {
    const sql = ` SELECT id_employe FROM employé WHERE email= $1 `
    const values = [email];
    const response = await db.query(sql, values)
    return response.rows[0];
}