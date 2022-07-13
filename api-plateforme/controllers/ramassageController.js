import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/commande_contenu.js';
import * as articles from '../models/article.js';
import * as attribution from '../models/commande_attribution.js';
import * as historique from '../models/commande_historique.js';
import { addToHistory } from './commadeHistoriqueController.js';
import createError from 'http-errors';
import axios from 'axios';


export const choixMagasin = catchAsync(function(request,response,next) {

    const id_article_commande = request.body.id_article_commande;
    const nom_magasin= request.body.magasin;

    if (!id_article_commande || !nom_magasin) return next(createError(400, "L'article ou le nom du magasin n'a pas été trouvé"))

    const article = contenu.unArticleCommande(id_article_commande);

    if (!article) return next(createError("L'article dans la commande sélectionné n'a pas été trouvé"))
    

    return response.status(201).json({
        status: "ok"
    })
})