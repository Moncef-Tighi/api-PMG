import { catchAsync } from './errorController.js';
import * as model from '../models/ramassage.js';
import * as contenu from '../models/commande_contenu.js';
import * as articles from '../models/article.js';
import * as attribution from '../models/commande_attribution.js';
import * as historique from '../models/commande_historique.js';
import { addToHistory } from './commadeHistoriqueController.js';
import createError from 'http-errors';
import axios from 'axios';


export const choixMagasin = catchAsync(async function(request,response,next) {

    const id_article_commande = request.body.id_article_commande;
    const nom_magasin= request.body.magasin;
    const raison = request.body.raison;

    if (!id_article_commande || !nom_magasin) return next(createError(400, "L'article ou le nom du magasin n'a pas été trouvé"))

    const article = await contenu.unArticleCommande(id_article_commande);

    if (!article) return next(createError("L'article dans la commande sélectionné n'a pas été trouvé"))

    if (article.confirmation_magasin || article.confirmation_prestataire) 
        return next(createError("Vous ne pouvez pas changer le magasin pour un article qui a déjà été ramassé"))

    if (article.nom_magasin) {
        if (!raison) return next(createError("Vous ne pouvez pas modifier le magasin sans raison"))
        addToHistory(request.user.id_article_commande, article.id_commande, "Modification magasin", raison)
    }

    const ramassage = await model.ajoutPointRamassage(id_article_commande, nom_magasin);

    //TODO : 
    //Ajouter une vérification, si l'article qu'on vient de sélectionner comme magasin était le dernier à ne pas être attribuée
    //La commande passe en status : "En attente de magasin"

    return response.status(201).json({
        status: "ok",
        ramassage,
    })
})