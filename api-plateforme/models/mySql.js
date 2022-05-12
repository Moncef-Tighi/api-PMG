import mysql from "mysql2/promise";
// create the connection to database
try {

    var db = mysql.createPool({
        host: process.env.MY_HOST,
        user: process.env.MY_USER,
        password: process.env.MY_PASSWORD,
        database: process.env.MY_DATABASE
    });
    await db.execute(`SELECT 1+1`);
    console.log("Connexion à la base de donnée de WordPress réussie");
} catch(error) {
    console.error(`Impossible de se connecter à la base de donnée de WordPress : ${error}`);
}

export default db