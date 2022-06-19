import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/contenu_commande.js';
import * as articles from '../models/article.js';
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
            if(art.stockNet<=process.env.MINSTOCK) throw `La taille demandé pour ${art.GA_CODEARTICLE} n'est plus disponible`
            const quantite = contenu_commande.find(content => content.code_barre === art.GA_CODEBARRE).quantité
            if (!quantite || quantite<1) throw `La quantité demandé pour l'article ${art.GA_CODEARTICLE}  n'a pas été trouvé`
            if(art.stockNet - quantite<0) throw `Il y a moins de ${quantite} pièces disponible pour l'article ${art.GA_CODEARTICLE}`
        })
    } catch(error) {
        return next(createError(400, error))
    }
    const createdCommande = await model.createCommande(commande);
    if (!createdCommande) return next(createError(409, "La création de la commande a échouée"))

    //Avant de vraiment valider l'article, il faut obtenir le prix. On ne peut pas demander le prix en paramètre
    //Parce que sinon n'importe qui pourrait demander un prix incorrect en modification la requête.
    //Vu que tout les articles ne sont pas sur la plateforme, on commence par chercher l'article sur la plateforme
    //Si il n'existe pas sur la plateforme on cherche le prix sur CEGID

    const codes_articles= stock.data.body.articles.map(art=> art.GA_CODEARTICLE);
    const articlesPlateforme = await articles.readArticles(codes_articles)
    const articlesHorsPlateforme = codes_articles.filter(art=> !articlesPlateforme.some(article=> article.code_article===art))
    //Attention ! l'API Cegid ne gère pas les prix par code_barre, juste les prix par code article. Donc l'output ne rends pas le code barre
    let articlesCegid = await axios.post(`${process.env.API_CEGID}/tarifs`, {articles : articlesHorsPlateforme});
    articlesCegid = articlesCegid.data.body.articles
    let prices = [];
    console.log(articlesPlateforme);
    articlesPlateforme.forEach(article=> prices.push({code_article : article.code_article, prix : article.prix_vente}))
    Object.keys(articlesCegid).forEach(code_article=> prices.push({code_article, prix : articlesCegid[code_article].prixActuel}))

    //À partir de maintenant on a les prix dans "prices"


    const createdContenu = contenu_commande.map(async (article)=> {
        //La logique pour récupérer le prix est bizarre. Mais c'est obligé parce que le prix est lié à l'article
        //Là où le client commande un code barre
        const result = await contenu.addArticleToCommand(createdCommande.id_commande,article.code_barre, article.quantité,
            prices.find(price => 
                price.code_article === stock.data.body.articles.find(art=> art.GA_CODEBARRE===article.code_barre).GA_CODEARTICLE
                ).prix)
        return result;
    })

    return response.status(201).json({
        status: "ok",
        commande : createdCommande,
        contenu_commande : createdContenu
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