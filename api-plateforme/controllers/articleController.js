import { catchAsync } from './errorController.js';
import * as model from '../models/article.js';
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
    
    const code_article= request.body.code_article;
    const libelle= request.body.libelle;
    const marque = request.body.marque;
    const type= request.body.type;
    const date_creation = request.body.date_creation;
    const prix_vente = request.body.prix_vente;
    const description = request.body.description;
    const tags = request.body.tags;
    const tailles = request.body.taille;
    if (!code_article || !tailles || !prix_vente || prix_vente<10) return next(createError(400, `Impossible de créer l'article : une information obligatoire n'a pas été fournit`))
    const result = await model.insertArticle(code_article, libelle, marque, type, date_creation, prix_vente, description, tags);

    tailles.forEach( async taille => {
        await model.insertTaille(code_article, taille.dimension, taille.code_barre)
    })
    return response.status(201).json({
        status : "ok",
        message : "L'article a bien été mis en vente sur la plateforme",
        body : result    
    })
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


