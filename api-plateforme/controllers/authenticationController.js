import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import {compare} from 'bcrypt';
import createError from 'http-errors'
import {readFileSync} from 'fs';
import {resolve} from 'path';
import generateKeyPairSync from '../util/generateKeyPair.js';
import jwt from 'jsonwebtoken';

import {Strategy} from 'passport-jwt'
import {ExtractJwt} from 'passport-jwt'

import passport from 'passport';

try {
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
} catch(error) {
    generateKeyPairSync();
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
}


const signJwt = function(employe) {
    const token = jwt.sign({
        employe_id : employe.employe_id,
        permission : employe.permissions,
        iat: Math.floor(Date.now() / 1000) - 30
    }, privateKey, {
        algorithm: 'RS256',
        expiresIn : process.env.JWT_EXPIRATION || '1d',
    })
    return token;
};

export const connexion = catchAsync( async function(request, response, next) {
    
    const email = request.body.email;
    const password = request.body.password;
    if (!email | !password) return next(createError(400, `Email ou mot de passe introuvable`))
    const employe = await model.employeLogin(email);
    if (!employe) return next(createError(400, `Email incorrecte`));

    if (compare(password, employe.password)) {
        const token = signJwt(employe)
        return response.status(200).json({
            status:"ok",
            token
        });
    } else {
        return next(createError(400, `Mot de passe incorrect`))
    }

    
});


const authStrategyOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: publicKey,
    algorithms : ['rs256']
}

export const protect = passport.use(new Strategy(authStrategyOptions, function(jwt_payload, done) {

    try {
        const employe = await model.employeLogin(jwt_payload.employe_id);
        if (!employe) return done(null, false, `le token est invalide ou expiré`);
        //Ici, on vérifie si les permissions n'ont pas changés depuis le moment ou le JWT a été signé
        //Si c'est le cas alors le token n'est plus valide
        if (employe.permissions.sort().toString() != jwt_payload.permissions.sort().toString()){
            return done(null, false, {error : `les permissions de l'utilisateur n'existe pas`});
        }
        return done(null, employe);
    } catch(error) {
        return done (error, false)
    }

}));


export const changeMyPassword = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});


export const restrict = catchAsync( async function(request, response) {
    //Fonction qui vérifie que l'utilisateur a le droit d'accéder à la route
    return response.status(200).send("ok");

});