import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/contenu_commande.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";
import axios from 'axios';


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
    const contenu_commande = request.body.contenu_commande;

    if (!commande) return next(createError(400, 'Impossible de trouver la commande'))
    if (!contenu_commande || contenu_commande.constructor!== Array) return next(createError(400, "Le contenu de la commande est invalide"))
    if (!commande.adresse || !commande.numero_client ||
        !commande.email_client || !commande.numero_commune ||
        !commande.nom_client || !commande.prenom_client)
        return next(createError(400, "Une information obligatoire n'a pas été fournit"))
    if (!commande.id_prestataire || Number(commande.id_prestataire)<0) return next(createError(400), "Impossible de trouver le prestataire de la commande")
    if (commande.commune<0 || commande.commune>1550) return next(createError(400, "Le numéro de la commune n'est pas valide"))
    //Adding type validation for the commande

    
    //Section de vérification essentielle pour vérifier qu'il n'y a pas de problème de stock ET que la requête est valide

    const code_barres = contenu_commande.map(taille=> taille.code_barre);
    const stock = await axios.post(`${process.env.API_CEGID}/articles/taille?code_barre=true`, {articles : code_barres});
    if (stock.data.body.articles.length != code_barres.length) return next(createError(400, "Un des articles demandé n'existe pas"));
    try {
        stock.data.body.articles.forEach(art=> {
            if(art.stockNet<process.env.MINSTOCK) throw `La taille demandé pour ${art.GA_CODEARTICLE} n'est plus disponible`
            const quantite = contenu_commande.find(content => content.code_barre === art.GA_CODEBARRE).quantité
            if(art.stockNet - quantite<0) throw `Il y a moins de ${quantite} pièces disponible pour l'article ${art.GA_CODEARTICLE}`
        })
    } catch(error) {
        return next(createError(400, error))
    }
    const createdCommande = await model.createCommande(commande);
    
    if (!createdCommande) return next(createError(409, "La création de la commande a échouée"))


    try {
        const createdContenu = contenu_commande.map(async (article)=> {
            if (!article.code_barre || !article.quantité || article.quantité<1) throw Error("Un article dans la commande est invalide")
            const result = await contenu.addArticleToCommand(createdCommande.id_commande,article.code_barre, article.quantité, article.prix_vente)
            return result;
        })

        return response.status(201).json({
            status: "ok",
            commande : createdCommande,
            contenu_commande : createdContenu
        });
    } catch(error) {
        return next(createError(400, "La sauvgarde du contenu de la commande a échouée"))
    }


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