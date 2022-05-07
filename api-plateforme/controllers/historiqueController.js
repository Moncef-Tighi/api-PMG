import { catchAsync } from './errorController.js';
import * as model from '../models/permissions.js';
import createError from 'http-errors';

//Fonction plutôt que controller ?
//Sauvgarder les actions via des middleware plutôt ? ça pourrait être malin.

export const nouvelleAction = catchAsync(async function(request,response, next) {
    
    
    return response.status(200).json({
        status: "ok",
        message: "",
    });

});

export const listeAction = catchAsync(async function(request,response, next) {
    //Il faut que cette requête soit filtrée    
    
    return response.status(200).json({
        status: "ok",
        message: "",
    });

});
