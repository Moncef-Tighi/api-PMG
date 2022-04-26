import { catchAsync } from './errorController.js';
import * as model from '../models/permissions.js';
import * as employe from '../models/employe.js';
import createError from 'http-errors';

export const idFromEmailAndRole = catchAsync(async function(request, response , next) {
    if (!request.body.id_employe){
        const email=request.body.email
        if (!email) return(next(createError(404, `aucun employé n'a été trouvé`)))
        const result = await employe.findEmployeId(email);
        if (!result) return(next(createError(404,  `l'employé' indiqué n'existe pas.`)));    
        request.body.id_employe=result.id_employe;
    }
    if (!request.body.id_role) {
        const role=request.body.role
        if (!role) return(next(createError(404, `aucun rôle n'a été trouvé`)))
        const result= await model.findRoleId(role);
        if (!result) return(next(createError(404,  `le role indiqué n'existe pas.`)));
        request.body.id_role=result.id_role;
    }
    next();
});

export const addPermission = catchAsync( async function(request, response) {

    await model.addRole(request.body.id_employe, request.body.id_role);
    return response.status(200).json({
            status: "ok",
            message: "La nouvelle permission a bien été ajoutée",
        });

})

export const removePermission = catchAsync(async function(request,response) {
    await model.deletePermission(request.body.id_employe, request.body.id_role);
    return response.status(200).json({
        status: "ok",
        message: "La permission a bien été retirée",
    });

});


export const createPermission = catchAsync(async function(request, response) {

})

export const deletePermission = catchAsync(async function(request, response) {
    
})