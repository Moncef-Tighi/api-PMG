import express from "express";
import helmet from 'helmet';
import createError from "http-errors";
import cors from 'cors';

import { errorHandeler } from "./controllers/errorController.js";
import produitsRouter from './routes/articlesRouter.js';
import viewRouter from './routes/viewRouter.js';

 
const app = express();

app.use(cors());
app.use(helmet());
app.set('view engine', 'ejs');
app.disable('x-powered-by');
app.use(express.json({
    limit : "100kb" //Limite la taille du body à 10s0kb
}));
app.use(express.urlencoded({extended: true}));


app.use(express.static('public'));
app.use('/api/v1/articles', produitsRouter);
app.use('/', viewRouter);
// app.use('/test', (request,response) => {
//     console.log(request.query);
//     return response.status(200).json("ok");
// });

app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});

app.use(errorHandeler);

const port = process.env.PORT || 2000;

app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});