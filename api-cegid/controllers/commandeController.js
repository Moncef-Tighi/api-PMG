import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'

export const commande = catchAsync( async function(request, response,next){
    const commande = request.body.commande

    if (!commande) {
        return next(createError(400,`Impossible de trouver la propriété commande dans le body de la requête`));
    }

    //Avant de toucher à la base de donnée, il faut vérifier que la commande est valide.
    for (const produit of commande) {
        const nom = produit.produit;
        const quantité = produit.quantité;

        if (!nom || !quantité) {
            return next(createError(400,`Aucun nom ou quantité n'a été fournit pour l'un des produits`));
        }
        if (quantité<1) {
            return next(createError(400,`Le produit: '${nom}' a été demandé dans une quantité invalide , la commande a été annulée`));
        } 

        const produitAcutel = await model.getOneProduits(nom);

        if (!produitAcutel) {
            return next(createError(400,`Aucun produit '${nom}' n'a été trouvé, la commande a été annulée`));
        }
        if (produitAcutel.stock-quantité<5) {
            return next(createError(400,`Le stock du produit : '${nom}' n'est pas suffisant pour commander ${quantité} ${nom}, la commande a été annulée`));
        }
    };


    //À ce stade, chaque produit demandé a été vérifié.
    commande.forEach(catchAsync(async produit=> await model.updateStock(produit.quantité, produit.produit) ));

    return response.status(200).json({
        status: 'ok',
        message : "La commande a bien été effecuté",
    })
});

