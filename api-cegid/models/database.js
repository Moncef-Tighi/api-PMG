import db from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: String(process.env.DB_ADDRESS),
    options: {
        //encrypt: true,
        trustServerCertificate: true // à enlever en situation réel. Permet d'accepter les self-signed certificate
    }
}

//J'utilise une fonction ici juste pour avoir accès à Async
const connexion = async function() {
    try {
        await db.connect(config)
        console.log("Connexion à la base de donnée réussie.");
        //TODO : Enlever la querry de test
        const test = await db.query`SELECT 'ok' as test`;
        console.log("Querry de test : "+ test.recordset[0].test);
        return db
    } catch (err) {
        console.error(`Erreur critique ! Impossible de se connecter à la base de donnée
        Erreur : ${err}`);
    }
}
connexion();

export default db;