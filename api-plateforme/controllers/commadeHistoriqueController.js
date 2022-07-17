import { catchAsync } from './errorController.js';
import * as historique from '../models/commande_historique.js';
import createError from 'http-errors';

//NOTE : L'historique est crée par cette fonction parce que parfois on veut juste envoyer une requête pour ajouter quelque chose à l'historique 
//(exemple : Quand un appel est effectuée on fait rien côté code à part enregistrer dans l'historique)

//Et parfois on veut ajouter à l'historique après qu'une action soit effectuée 
//(par exemple : Quand l'attribution de la commande change)

export const addToHistory = async function(id_employe, commande_id, type, raison, description="") {

    if (!commande_id) throw new Error("L'id de la commande n'a pas été fournit")
    if (!type) throw new Error("Impossible d'ajouter l'action dans l'historique, aucun type d'actions n'a été spécifié")
    if (!id_employe) throw new Error("L'id de l'employé n'a pas été reçu");

    switch(type) {
        case "Attribution":
            description= "La commande a été attribuée à un autre employé"
            break;
        case "Première Attribution":
            description= "Première attribution de la commande"
            break;
    }

    const creationHistorique = await historique.createHistorique(commande_id, id_employe, type, description, raison)
    return creationHistorique
}


export const historiqueOneCommande = async function(request,response,next) {

    //L'historique doit être paginé ! Il pourrait y en avoir 20-30 dans certains cas.
    //Faudra probablement un infinitescroll à la fin de la page

    const id_commande = request.params.id;
    const page = request.query.page || 1;

    if(!id_commande) return next(createError(400, "Aucune id n'a été trouvé pour la commande"));

    const historique = await historique.OneHistorique(id_commande, page);

}