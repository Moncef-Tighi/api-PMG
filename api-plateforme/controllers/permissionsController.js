import { catchAsync } from './errorController.js';
import * as model from '../models/permissions.js';
import * as employe from '../models/employe.js';
import createError from 'http-errors';
import newAction from './historiqueController.js';

export const emailAndRoleAndId = catchAsync(async function(request, response , next) {

    //ça peut sembler overkill de réccupérer l'id, l'email et le nom du role pour chaque requête
    //Mais c'est ce qu'il y a de mieux pour améliorer la lisibilité et les options
    //à la fois côté programmation et côté historique des actions.
    //Toute fois, la requête n'a vraiment besoin que de l'id de l'employé et du rôle pour enregistrer le changement

    if (!request.body.email){
        const id=request.body.id_employe
        if (!id) return(next(createError(404, `aucun employé n'a été trouvé`)))
        const result = await employe.findEmploye(email);
        if (!result) return(next(createError(404,  `l'employé' indiqué n'existe pas.`)));    
        request.body.email=result.email;
    }
    if (!request.body.role) {
        const role=request.body.id_role
        if (!role) return(next(createError(404, `aucun rôle n'a été trouvé`)))
        const result= await model.findRole(role);
        if (!result) return(next(createError(404,  `le role indiqué n'existe pas.`)));
        request.body.role=result.nom_role;
    }
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



export const newPermission = catchAsync( async function(request, response) {

    await model.addPermission(request.body.id_employe, request.body.id_role);

    newAction(request.user.id_employe,request.body.id_employe,"employe", "admin",
    `${request.user.nom} ${request.user.prenom} a ajouté la permission ${request.body.role} à ${request.body.email} `)
    
    return response.status(200).json({
            status: "ok",
            message: "La nouvelle permission a bien été ajoutée",
        });

})

export const removePermission = catchAsync(async function(request,response) {
    console.log("ok");
    await model.deletePermission(request.body.id_employe, request.body.id_role);

    newAction(request.user.id_employe,request.body.id_employe,"employe", "admin",
    `${request.user.nom} ${request.user.prenom} a retiré la permission ${request.body.role} à ${request.body.email} `)
    
    return response.status(200).json({
        status: "ok",
        message: "La permission a bien été retirée",
    });

});
