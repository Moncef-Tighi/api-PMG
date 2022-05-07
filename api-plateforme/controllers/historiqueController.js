import { catchAsync } from './errorController.js';
import * as model from '../models/historique.js';
import createError from 'http-errors';

//Fonction plutôt que controller ?


const newAction = async function(employe, action_sur,categorie,type,description){
    if (!action_sur || !categorie) throw new Error("Impossible de logger une nouvelle action. Une information est manquante")
    if (!employe) throw new Error("L'employé effectuant l'action n'a pas été fournit");

    
    await model.createAction(employe, String(action_sur), categorie, type, description)
    return
};

export default newAction

export const listeAction = catchAsync(async function(request,response, next) {
    //Il faut que cette requête soit filtrée    
    
    return response.status(200).json({
        status: "ok",
        message: "",
    });

});
