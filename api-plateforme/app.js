import express from "express";
import helmet from 'helmet';
import createError from "http-errors";
import cors from 'cors';

import { errorHandeler } from "./controllers/errorController.js";
import apiRouter from './routes/Router.js';
//import produitsRouter from './routes/articlesRouter.js';
 
import { ToadScheduler, SimpleIntervalJob } from "toad-scheduler";
import { autoUpdateStock } from "./scheduleStockUpdate.js";

const app = express();

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({
    limit : "100kb" //Limite la taille du body à 100kb
}));
app.use(express.urlencoded({extended: true}));

app.use('/plateforme/api/v1', apiRouter);
app.use(express.static('public'));
app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});


const scheduler = new ToadScheduler();

const jobForStockUpdate = new SimpleIntervalJob(
	{ minutes: process.env.UPDATE_STOCK_EVERY_MINUTE, runImmediately: true },
	autoUpdateStock,
	'id_1'
);

scheduler.addSimpleIntervalJob(jobForStockUpdate);


app.use(errorHandeler);

const port = process.env.PORT || 2000;
app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});