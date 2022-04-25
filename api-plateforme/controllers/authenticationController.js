import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import {hash, genSalt} from 'bcrypt';
import createError from 'http-errors'

export const listEmployes = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

export const createEmploye = catchAsync( async function(request, response, next) {

    const login = request.body.login;
    const nom = request.body.nom;
    const prenom= request.body.prenom;
    const poste = request.body.poste;
    if (!login || !nom || !request.body.password) {
        return next(createError(400, `Impossible de créer l'employé : une information obligatoire n'a pas été fournit.`))
    }
    const salt = await genSalt(10);
    const password = await hash(request.body.password, salt);
    console.log(password);
    console.log(salt);
    const result = await model.newEmploye(login, password, salt, nom, prenom, poste);
    console.log(result);
    return response.status(200).send("ok");

});

export const disableEmploye = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

export const modifyEmploye = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

