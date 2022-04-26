import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import {hash, genSalt} from 'bcrypt';
import createError from 'http-errors';



export const listEmployes = catchAsync( async function(request, response) {
    console.log(request.user);
    const employes= await model.allEmploye();
    return response.status(200).json({
        status: 'ok',
        body : employes
    });

});

export const findEmploye = catchAsync( async function(request, response,next) {
    if (!request.params.id) return next(createError(400, `Aucun id n'a été trouvé`));
    const employe= await model.oneEmploye(request.params.id);
    if (!employe) return next(createError(404, `Impossible de trouver un employe avec l'id ${request.params.id}`));
    return response.status(200).json({
        status: 'ok',
        body : employe
    });

})


export const createEmploye = catchAsync( async function(request, response, next) {

    const email = request.body.email;
    const nom = request.body.nom;
    const prenom= request.body.prenom;
    const poste = request.body.poste;
    if (!email || !nom || !request.body.password) {
        return next(createError(400, `Impossible de créer l'employé : une information obligatoire n'a pas été fournit.`))
    }
    const salt = await genSalt(10);
    const password = await hash(request.body.password, salt);
    const data = await model.newEmploye(email, password, nom, prenom, poste);
    delete data.password;
    return response.status(201).json({
        status: "ok",
        message : "L'employé a bien été créé",
        body : data
    });

});

export const disableEmploye = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});

export const modifyEmploye = catchAsync( async function(request, response) {

    return response.status(200).send("ok");

});
