import express from "express";

import passport from "passport";
import {Strategy} from 'passport-jwt'
import {ExtractJwt} from 'passport-jwt'
import { AuthStrategy } from "../controllers/authenticationController.js";

import generateKeyPairSync from '../util/generateKeyPair.js';
import {readFileSync} from 'fs';
import {resolve} from 'path';


import employeRouter from './employéRoute.js';
import permissionsRouter from './permissionsRouter.js';
import authenticationRouter from './authenticationRoute.js';
import roleRouter from "./roleRoute.js";
import articleRouter from './articleRoute.js';
import wooCommerceRouter from './wooCommerceRoute.js'
import commandeRouter from './commandeRoute.js';
import ramassageRouter from './ramassageRoute.js';

const router = express.Router();


router.use(passport.initialize()) 

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

router.use('/employes', employeRouter);
router.use('/permissions', permissionsRouter);
router.use('/roles', roleRouter);
router.use('/articles', articleRouter);
router.use('/connexion', authenticationRouter);
router.use('/woocommerce', wooCommerceRouter);
router.use('/commande', commandeRouter);
router.use('/ramassage', ramassageRouter);

export default router