import db from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: process.env.DB_ADDRESS,
    options: {
        trustServerCertificate: true // à enlever en situation réel. Permet d'accepter les self-signed certificate
    },
}

//J'utilise une fonction ici juste pour avoir accès à Async
const connexion = async function() {
    try {
        await db.connect(config)
        console.log("Connexion à la base de donnée réussie.");
        return db
    } catch (err) {
        console.error(`Erreur critique ! Impossible de se connecter à la base de donnée
        Détails : ${err}`);
        console.error(err.originalError);    
    }
}
connexion();

export default db;