import { catchAsync } from './errorController.js';
import * as model from '../models/permissions.js';
import createError from 'http-errors';


export const addPermission = catchAsync( async function(request, response) {
    
    const role=request.body.role
    if (!role) return(createError(404, `aucun rôle n'a été trouvé`))
    const {id_role}= await model.findRoleId(role);
    if (!id_role) return(createError(404,  `le role indiqué n'existe pas.`))
    return response.status(200).send("ok");

})