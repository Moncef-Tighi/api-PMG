import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import createError from 'http-errors'

import {readFileSync} from 'fs';
import {resolve} from 'path';
import generateKeyPairSync from '../util/generateKeyPair.js';

import {compare} from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

try {
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
} catch(error) {
    generateKeyPairSync();
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
}


const signJwt = function(employe) {
    const token = jwt.sign({
        employe_id : employe.id_employe,
        permissions : employe.permissions,
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

    if (await compare(password, employe.password)) {
        const token = signJwt(employe)
        return response.status(200).json({
            status:"ok",
            token
        });
    } else {
        return next(createError(400, `Mot de passe incorrect`))
    }

    
});



export const AuthStrategy = async function(jwt_payload, done) {
    //C'est une fonction qui est utilisé par Passport pour vérifier les informations du JWT après avoir vérifié sa signature
    try {
        const employe = await model.oneEmploye(jwt_payload.employe_id);
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

};


export const protect = passport.authenticate('jwt', {session: false});

export const restrict= function(...roles) {
    return (request, response, next)=> {
        const permissions = request.user.permissions;
        for (const permission of permissions) {
            if (roles.includes(permission)) return next();
        }
        return next(createError(403, `l'employé n'a pas le droit d'effectuer cette action`));
    }
}

export const changeMyPassword = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});
