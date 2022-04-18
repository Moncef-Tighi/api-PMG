import pg from "pg";

const {Pool} = pg;
const db= new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT, 
})
db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Connexion à la base de donnée réussie.");
    }
})

export default db;

  

