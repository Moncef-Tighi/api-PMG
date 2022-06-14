import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";



export const createLivraison = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});

export const listeLivraisonForCommande = catchAsync( async function(request, response, next) {


    return response.status(200).json({
        status: "ok",
    });
});


export const updateStatusLivraison = catchAsync( async function(request, response, next) {
    
    
    return response.status(200).json({
        status: "ok",
    });
});