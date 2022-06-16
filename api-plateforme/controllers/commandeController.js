import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";



export const listeCommandes = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});

export const oneCommande = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});


export const createCommande = catchAsync( async function(request, response, next) {
    const commande = request.body.commande
    if (!commande) return next(createError(400, 'Impossible de trouver la commande'))

    //Adding type validation for the commande

    
    return response.status(200).json({
        status: "ok",
    });
});


export const updateCommande = catchAsync( async function(request, response, next) {
    

    return response.status(200).json({
        status: "ok",
    });
});

export const disableCommande = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});

export const updateCommandeStatus = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
})

export const changeCommandeAttribution = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
})