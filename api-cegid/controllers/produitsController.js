import * as model from '../models/produits.js';
import { catchAsync } from './errorController.js';

export const listProduits = catchAsync( async function(request, response,next){
    
    const produits = await model.getAllProduits();
    return response.status(200).json({
        status : "ok",
        body : {
            produits,
        }
    })
});

export const detailProduit = catchAsync( async function(request, response,next){
    const produits = await model.getOneProduits(request.params.nom_produit);

    if (produits.length===0) {
        return response.status(204).json({
            status : 'ok',
            erreur : "Aucun produit avec ce nom n'a été trouvé",
            body : {
                produits : null
            }
        })
    }
    return response.status(200).json({
        status : 'ok',
        body : {
            produits,
        }
    })
});


export const produitsDisponible = catchAsync( async function(request, response,next){
    const produits = await model.getAllProduitsDisponibles();
    return response.status(200).json({
        status : "ok",
        body : {
            produits,
        }
    })
});

