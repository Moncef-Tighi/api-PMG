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