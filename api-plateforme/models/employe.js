import db from "./database.js";

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