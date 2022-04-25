import { catchAsync } from './errorController.js';
import * as model from '../models/permissions.js';
import * as employe from '../models/employe.js';
import createError from 'http-errors';


export const addPermission = catchAsync( async function(request, response) {
    
    const role=request.body.role
    if (!role) return(createError(404, `aucun rôle n'a été trouvé`))
    const {id_employe} = await employe.findEmployeId(request.body.email);
    if (!id_employe) return(createError(404,  `l'employé' indiqué n'existe pas.`));
    const {id_role}= await model.findRoleId(role);
    if (!id_role) return(createError(404,  `le role indiqué n'existe pas.`));

    const result = await model.addRole(id_employe, id_role);
    return response.status(200).send(result);

})