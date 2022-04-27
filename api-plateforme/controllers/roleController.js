import { catchAsync } from './errorController.js';
import * as model from '../models/role.js';
import createError from 'http-errors';


export const listeRole = catchAsync(async function(request, response) {

    return 
})


export const createRole = catchAsync(async function(request, response) {
    const nom = request.body.nom_role;

    return 
})

export const modifyRole = catchAsync(async function(request, response) {
    const nom = request.body.nom_role;

})

export const deleteRole = catchAsync(async function(request, response) {
    
})