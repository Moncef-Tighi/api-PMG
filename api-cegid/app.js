import express from "express";
import helmet from 'helmet';
import createError from "http-errors";

import { errorHandeler } from "./controllers/errorController.js";
import produitsRouter from './routes/articlesRouter.js';
import commandeRouter from './routes/commandeRouter.js';

 
const app = express();

app.use(helmet());
app.use(express.json({
    limit : "10kb" //Limite la taille du body à 10kb
}));
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/articles', produitsRouter);
app.use('/api/v1/commande', commandeRouter);

app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});

app.use(errorHandeler);

const port = process.env.PORT || 2000;

app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});