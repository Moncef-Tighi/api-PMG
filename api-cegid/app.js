import express from "express";
import helmet from 'helmet';
import createError from "http-errors";
import db from './database.js';

import { errorHandeler } from "./controllers/errorController.js";

const app = express();

app.use(helmet());
app.use(express.json({
    limit : "10kb" //Limite la taille du body à 10kb
}));
app.use(express.urlencoded({extended: true}));



app.get('/ok', async (request, response, next)=>{
    response.status(200).send("ok");
    try {
        const result = await db.query`SELECT * FROM produit`
        console.log(result);
        console.log("UI");    
    } catch(err) {
        console.log(err);
    }
});

app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});

app.use(errorHandeler);

const port = process.env.PORT || 2000;

app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});