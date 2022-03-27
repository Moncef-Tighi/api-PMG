import { json } from 'express';
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


export const commande = catchAsync( async function(request, response,next){
    const nom = request.params.nom_produit;
    const quantité = request.body.quantité;

    const produits = await model.getOneProduits(nom);

    if (produits.length===0) {
        return response.status(204).json({
            status : 'ok',
            erreur : "Aucun produit avec ce nom n'a été trouvé",
            body : {
                produits : null
            }
        })
    }

    if (!quantité && quantité<1) {
        return response.status(400).json({
            status : 'ok',
            erreur : "La quantité de produit demandé n'a pas été trouvé ou est invalide",
        })
    } 
    if (produits.stock-quantité<5) {
        return response.status(400).json({
            status : 'ok',
            erreur : "Le stock du produit demandé n'est pas suffisant pour effectuer cette commande",
        })
    }

    const resultat = await model.updateStock(quantité, nom)
    if (resultat.rowsAffected[0]===0) {
        return response.status(500).json({
            status : "error",
            message : "Une erreure inconnue a eu lieu, la commande n'a pas été prise en compte."
        })
    }

    return response.status(200).json({
        status: 'ok',
        message : "La commande a bien été effecuté",
        newStock : produits.stock - quantité
    })
});

