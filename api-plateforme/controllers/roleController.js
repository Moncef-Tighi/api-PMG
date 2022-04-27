import { catchAsync } from './errorController.js';
import * as model from '../models/role.js';
import createError from 'http-errors';


export const listeRole = catchAsync(async function(request, response) {
    const roles = await model.readRoles();

    return response.status(200).json({
        status: 'ok',
        body : roles
    })
})


export const createRole = catchAsync(async function(request, response, next) {
    const nom = request.body.nom_role;
    if (!nom) return next(createError(400, `Aucun nom n'a été trouvé pour le nouveau rôle`))
    const role = await model.createRole(nom);
    return response.status(200).json({
        status : "ok",
        body : role
    })
})

export const modifyRole = catchAsync(async function(request, response) {
    const nom = request.body.nom_role;
    const id = request.body.id_role;
    if (!nom || !id) return next(createError(400, `L'id ou le nom du rôle n'a pas été fournit`))
    const role = await model.updateRole(id,nom);
    return response.status(200).json({
        status : "ok",
        body : role
    })

})

export const deleteRole = catchAsync(async function(request, response) {
    const id = request.body.id_role;
    if (!id) return next(createError(400, `L'id du rôle n'a pas été fournit`))
    await model.updateRole(id);
    return response.status(200).json({
        status : "ok",
        message : "le role a bien été supprimé"
    })

})