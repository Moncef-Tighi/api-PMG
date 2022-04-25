import db from "./database.js";

export const newEmploye = async function(login, password, nom, prenom="", poste=""){
    const sql = `
    INSERT INTO employé(login, password, nom, prenom, poste, date_creation)
    VALUES 
    ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP )
    RETURNING *
    `
    const values = [login, password, nom, prenom, poste];
    const response = await db.query(sql, values)
    return response;
}