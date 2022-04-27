import { catchAsync } from './errorController.js';
import * as model from '../models/article';
import createError from 'http-errors';



export const listeArticle = catchAsync( async function(request, response) {
    //Côté client
    return response.status(200).json({
        status: 'ok',
    });

});

export const unArticle = catchAsync( async function(request, response) {
    //Côté client
    return response.status(200).json({
        status: 'ok',
    });

});

export const ajoutArticle = catchAsync(async function(request, response) {

    
})

export const articleEtat = catchAsync( async function(request, response) {
    //Est-ce que l'article est mis en vente sur la plateforme ? Si oui, est-il activé ?

    return response.status(200).json({
        status: 'ok',
    });

});


export const updatePrixArticle = catchAsync( async function(request, response) {
    //Utilisé pour la page comparaison de prix

    return response.status(200).json({
        status: 'ok',
    });

});

export const disableArticle = catchAsync( async function(request, response) {

    return response.status(200).json({
        status: 'ok',
    });

});

export const enableArticle = catchAsync( async function(request, response) {

    return response.status(200).json({
        status: 'ok',
    });

});


