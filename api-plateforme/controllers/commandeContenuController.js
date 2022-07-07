import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/commande_contenu.js';
import * as articles from '../models/article.js';
import * as attribution from '../models/commande_attribution.js';
import * as historique from '../models/commande_historique.js';
import { addToHistory } from './commadeHistoriqueController.js';
import createError from 'http-errors';

export const addToCommandeContenu = catchAsync( async function(request, response, next) {
    
    const commande = request.body.commande;
    commande.id_commande = request.params.id;

    if (!contenu_commande || contenu_commande.constructor!== Array) return next(createError(400, "Le contenu de la commande est invalide"))


    return response.status(200).json({
        status: "ok",
    });
});

export const removeFromCommandeContenu = catchAsync( async function(request, response, next) {
    
    const commande = request.body.commande;
    commande.id_commande = request.params.id;

    if (!contenu_commande || contenu_commande.constructor!== Array) return next(createError(400, "Le contenu de la commande est invalide"))


    return response.status(200).json({
        status: "ok",
    });
});

