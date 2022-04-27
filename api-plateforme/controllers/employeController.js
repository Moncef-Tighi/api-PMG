import { catchAsync } from './errorController.js';
import * as model from '../models/employe.js';
import {hash, genSalt} from 'bcrypt';
import createError from 'http-errors';



export const listEmployes = catchAsync( async function(request, response) {

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

export const profile = catchAsync( async function(request, response,next) {

    const employe= await model.oneEmploye(request.user.id_employe);

    return response.status(200).json({
        status: 'ok',
        body : employe
    });

})


const hashPassword = async function(clearTextPassword) {
    const salt = await genSalt(10);
    return await hash(clearTextPassword, salt);
};

export const createEmploye = catchAsync( async function(request, response, next) {

    const email = request.body.email;
    const nom = request.body.nom;
    const prenom= request.body.prenom;
    const poste = request.body.poste;
    if (!email || !nom || !request.body.password) {
        return next(createError(400, `Impossible de créer l'employé : une information obligatoire n'a pas été fournit.`))
    }
    const password = await hashPassword(request.body.password);
    const data = await model.newEmploye(email, password, nom, prenom, poste);
    delete data.password;
    return response.status(201).json({
        status: "ok",
        message : "L'employé a bien été créé",
        body : data
    });

});

export const modifyEmploye = catchAsync( async function(request, response, next) {

    const id_employe = request.body.id_employe;
    const email = request.body.email;
    const nom = request.body.nom;
    const prenom= request.body.prenom;
    const poste = request.body.poste;
    if (!email || !nom || !id_employe) {
        return next(createError(400, `Impossible de modifier l'employé : une information obligatoire n'a pas été fournit.`))
    }
    const data = await model.changeEmploye(id_employe, email, nom, prenom, poste);
    delete data.password;
    return response.status(201).json({
        status: "ok",
        message : "L'employé a bien été modifié",
        body : data
    });


});

export const changeMyPassword = catchAsync( async function(request, response, next) {
    const newPassword = request.body.password;
    if (!newPassword) return next(createError(400, `aucun mot de passe n'a été spécifié`));
    const password = await hashPassword(newPassword);

    await model.changePassword(request.user.id_employe, password);
    return response.status(200).json({
        status:'ok',
        message: "Votre mot de passe a bien été changé, veuillez vous reconnecter."
    })
});

export const changeAnyPassword = catchAsync(async function(request, response, next) {
    const newPassword = request.body.password;
    if (!newPassword) return next(createError(400, `aucun mot de passe n'a été spécifié`));
    const id_employe = request.body.id_employe;
    if (!id_employe) return next(createError(400, `aucun employé n'a été spécifié`));

    const password = await hashPassword(newPassword);

    await model.changePassword(id_employe, password);
    return response.status(200).json({
        status:'ok',
        message: "Le mot de passe de l'employé a bien été changé."
    })

})

export const disableEmploye = catchAsync( async function(request, response) {
    const id_employe = request.body.id_employe;
    if (!id_employe) return next(createError(400, `aucun employé n'a été spécifié`));

    await model.activationEmploye(id_employe, false);

    return response.status(200).json({
        status: "ok",
        message: "L'employé a bien été désactivé."
    });

});

export const enableEmploye = catchAsync(async function(request, response) {
    const id_employe = request.body.id_employe;
    if (!id_employe) return next(createError(400, `aucun employé n'a été spécifié`));

    await model.activationEmploye(id_employe, true);

    return response.status(200).json({
        status: "ok",
        message: "L'employé a bien été activé."
    });

});
