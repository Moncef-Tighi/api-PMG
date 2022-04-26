import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import {compare} from 'bcrypt';
import createError from 'http-errors'
import {readFileSync} from 'fs';
import {resolve} from 'path';
import generateKeyPairSync from '../util/generateKeyPair.js';
try {
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
} catch(error) {
    generateKeyPairSync();
    var publicKey = readFileSync(resolve('key_public.pem'), {encoding: 'utf-8'});
    var privateKey = readFileSync(resolve('key_prive.pem'), {encoding: 'utf-8'});
}

const sendJWT = function(user, statusCode, response) {

};

export const connexion = catchAsync( async function(request, response) {
    
    return response.status(200).send("ok");
    
});

export const deconnexion = catchAsync( async function(request, response) {
    
    return response.status(200).send("ok");
    
});

export const changeMyPassword = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

export const protect = catchAsync( async function(request, response) {
    //Fonction qui vérifie que l'utilisateur est connecté

    return response.status(200).send("ok");

});

export const restrict = catchAsync( async function(request, response) {
    //Fonction qui vérifie que l'utilisateur a le droit d'accéder à la route
    return response.status(200).send("ok");

});