import { catchAsync, errorHandeler } from './errorController.js';
import * as historique from '../models/commande_historique.js';
import createError from 'http-errors';


export const addToHistory = async function(commande_id, type, raison, description="") {

    if (!commande_id) throw new Error("L'id de la commande n'a pas été fournit")
    if (!type) throw new Error("Impossible d'ajouter l'action dans l'historique, aucun type d'actions n'a été spécifié")
    if (!request.user.id_employe) throw new Error("L'employé n'est pas connecté, impossible d'ajouter son action à l'historique");

    let description= ""
    switch(type) {
        case "Attribution":
            description= "La commande a été attribuée à un autre employé"
            break;
        case "Première Attribution":
            description= "Première attribution de la commande"
            break;
        default :
            throw new Error("Le type d'action obtenu n'existe pas");
    }

    const creationHistorique = await historique.createHistorique(commande_id, request.user.id_employe, type, description, raison)
    return creationHistorique
}