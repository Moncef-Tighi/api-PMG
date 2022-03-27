import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import createError from "http-errors";

import { errorHandeler } from "./controllers/errorController.js";

const app = express();
dotenv.config('./config.env');

app.use(helmet());
app.use(express.json({
    limit : "10kb" //Limite la taille du body à 10kb
}));
app.use(express.urlencoded({extended: true}));



app.get('/ok', (request, response, next)=>{
    response.status(200).send("ok");
});

app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});

app.use(errorHandeler);

const port = process.env.PORT || 3000;

app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});