import db from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: String(process.env.DB_ADDRESS),
    options: {
        trustServerCertificate: true // à enlever en situation réel. Permet d'accepter les self-signed certificate
    }
}
  
const connexion = async function() {
    try {
        await db.connect(config)
        console.log("Connexion à la base de donnée réussie.");
        const result = await db.query`SELECT * FROM produit`
        console.dir(result)
    } catch (err) {
        console.error(`Erreur critique ! Impossible de se connecter à la base de donnée
        Erreur : ${err}`);
    }
}
connexion();
  
export default db;