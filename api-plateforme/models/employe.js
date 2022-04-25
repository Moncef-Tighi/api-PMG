import db from "./database.js";

export const newEmploye = async function(login, password, salt, nom, prenom="", poste=""){
    const sql = `
    INSERT INTO employé(login, password, salt, nom, prenom, poste, date_creation)
    VALUES 
    ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP )
    RETURNING *
    `
    const values = [login, password, salt, nom, prenom, poste];
    const response = await db.query(sql, values)
    return response;
}