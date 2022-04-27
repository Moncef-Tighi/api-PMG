import express from "express";
import helmet from 'helmet';
import createError from "http-errors";
import cors from 'cors';
import {readFileSync} from 'fs';

import passport from "passport";
import { AuthStrategy } from "./controllers/authenticationController.js";
import {Strategy} from 'passport-jwt'
import {ExtractJwt} from 'passport-jwt'
import generateKeyPairSync from './util/generateKeyPair.js';
import {resolve} from 'path';


import employeRouter from './routes/employéRoute.js';
import permissionsRouter from './routes/permissionsRouter.js';
import authenticationRouter from './routes/authenticationRoute.js';
import roleRouter from "./routes/roleRoute.js";

import { errorHandeler } from "./controllers/errorController.js";
//import produitsRouter from './routes/articlesRouter.js';
 
const app = express();

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json({
    limit : "100kb" //Limite la taille du body à 100kb
}));
app.use(express.urlencoded({extended: true}));

app.use(passport.initialize()) 

try {
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
} catch(error) {
    generateKeyPairSync();
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
}

const authStrategyOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms : ['RS256'],
    jsonWebTokenOptions : {
        maxAge : process.env.JWT_EXPIRATION || '1d'
    }
}

passport.use('jwt', new Strategy(authStrategyOptions, AuthStrategy));
app.use(express.static('public'));
app.use('/api/v1/employes', employeRouter);
app.use('/api/v1/permissions', permissionsRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/', authenticationRouter);


//app.use('/api/v1/articles', produitsRouter);
app.all('*', (request, response, next)=> {    
    //Ce middelware a pour seul but de catch les erreurs 404 
    return next(createError(404, `Erreur 404 : Impossible de trouver l'URL ${request.originalUrl} sur ce serveur`))
});

app.use(errorHandeler);

const port = process.env.PORT || 2000;

app.listen(port, ()=> {
    console.log(`Server ouvert sur le port ${port}`);
});