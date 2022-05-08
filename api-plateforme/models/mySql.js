import mysql from "mysql2/promise";
// create the connection to database
try {

    var db = mysql.createPool({
        host: process.env.MY_HOST,
        user: process.env.MY_USER,
        password: process.env.MY_PASSWORD,
        database: process.env.MY_DATABASE
    });
    console.log("Connexion à la base de donnée de WordPress réussie");
} catch(error) {
    console.error(error);
}

export default db