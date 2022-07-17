import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/commande_contenu.js';
import * as attribution from '../models/commande_attribution.js';
import * as historique from '../models/commande_historique.js';
import { addToHistory } from './commadeHistoriqueController.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";
import axios from 'axios';
import objectDeepEqual from '../util/objectDeepEqual.js';
import { verifyArticleStock, getPrices } from '../util/VerificationCommande.js';


export const listeCommandes = catchAsync( async function(request, response, next) {
    if (!request.query.active) request.query.active='true';

    const commandes = await model.listeCommandes(request.query);
    const totalSize = commandes.length
    return response.status(200).json({
        status: "ok",
        page : Number(request.query.page) || 1,
        totalSize,
        body : commandes
    });

});

export const oneCommande = catchAsync( async function(request, response, next) {

    const id = request.params.id;
    if (!id || isNaN(id) || id<0) return next(createError(400, "L'id présenté n'est pas valide"))
    const commande = await model.listeCommandes({"commande.id_commande" : id})
    if (commande.length===0) return next(createError(400, "Aucune commande avec cet ID n'a été trouvée"))

    //Le contenu de la commande est récupéré via une requête à part
    
    return response.status(200).json({
        status: "ok",
        commande: commande[0],
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
    
    //TODO : Adding type validation
    

    //Section pour éviter la duplication de commande

    const commandesByClient = await contenu.arrayOfCommandeForOneClient(commande.email_client);
    if (commandesByClient.length>0) {
        if (commandesByClient.some(commande=> objectDeepEqual(
            //On a besoin de sort les commandes parce qu'une commande peut être identique mais avoir les articles dans un ordre différent
            commande.articles.sort((a, b) =>  (a.code_barre > b.code_barre) ? 1 : ((b.code_barre > a.code_barre) ? -1 : 0)), 
            contenu_commande.sort((a, b) =>  (a.code_barre > b.code_barre) ? 1 : ((b.code_barre > a.code_barre) ? -1 : 0))
            ))) 
        return next(createError(400, "Duplication : Votre commande est déjà en cours de traitement")) 
    }

    //Section de vérification essentielle pour vérifier qu'il n'y a pas de problème de stock ET que la requête est valide

    try {
        var stock = await verifyArticleStock(contenu_commande);
    } catch(error) {
        return next(createError(400, error))
    }

    const prices = await getPrices(stock);
    //À partir de maintenant on a les prix dans "prices"

    const createdCommande = await model.createCommande(commande);
    if (!createdCommande) return next(createError(409, "La création de la commande a échouée"))

    const contenuPromises = await contenu_commande.map(async (article)=> {
        //La logique pour récupérer le prix dans "prices" est bizarre. Mais c'est obligé parce que le prix est lié au code article
        //Là où le client commande via un code barre

        const result = await contenu.addArticleToCommand(createdCommande.id_commande,article.code_barre, article.quantité,
            prices.find(price => 
                price.code_article === stock.find(art=> art.GA_CODEBARRE===article.code_barre).GA_CODEARTICLE
                ).prix)
        return result;
    })


    const createdContenu = await Promise.all(contenuPromises)
    await historique.createStatus(1, createdCommande.id_commande);

    return response.status(201).json({
        status: "ok",
        commande : createdCommande,
        contenu_commande : createdContenu
    });

});


export const updateCommande = catchAsync( async function(request, response, next) {
    
    // ATTENTION ! Cette route n'update que les informations global de la commande, pas le contenu.
    const commande = request.body.commande;
    commande.id_commande = request.params.id;

    if (!commande.adresse || !commande.numero_client ||
        !commande.email_client || !commande.numero_commune ||
        !commande.nom_client || !commande.prenom_client)
        return next(createError(400, "Une information obligatoire n'a pas été fournit"))

    if (!commande.id_prestataire || Number(commande.id_prestataire)<0) return next(createError(400), "Impossible de trouver le prestataire de la commande")
    if (commande.commune<0 || commande.commune>1550) return next(createError(400, "Le numéro de la commune n'est pas valide"))

    const oldCommande = model.getOneCommande(id_commande);
    if (!oldCommande) return next(createError(400, "Cette commande n'existe pas"))
    if (oldCommande.id_status>8) return next(createError(400, "Impossible de modifier une commande terminée"))
    if (oldCommande.id_status>2 && !request.body.rasion) return next(createError(400, "Impossible de modifier une commande confirmée sans raison"))
    try {
        const updatedCommande = await model.updateCommande(commande);
        if (oldCommande.id_status>2) await historique.createHistorique(id_commande, request.user.id_employe, "Modification", raison);
        else await historique.createHistorique(id_commande, request.user.id_employe, "Modification", "La commande a été modifié avant sa confirmation");
        
        return response.status(200).json({
            status: "ok",
            body : updatedCommande
        });
    } catch(error) {
        console.log(error);
        return next(createError(400, "Il y a eu une erreur lors de la modification"))
    }

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

    const id = request.params.id;
    const employe = request.user.id_employe;

    if (!id) return next(createError(400, "Aucune commande n'a été sélectionnée"))

    const commande = await attribution.getCommandeAttribution(id);

    let type= "";
    try {
        if (!commande || !commande.id_employe) {
            type = "Première Attribution"
            await historique.createStatus(2, id, "Commende attribuée à un employé pour la première fois")
        }
        else if (commande.id_employe===employe) {
            return next(createError(400, "La commande est déjà attribuée à l'employé"))
        }
        else {
            if (!request.body.raison) return next(createError(400, "Vous ne pouvez pas changer l'attribution d'une commande sans raison"))
            type= "Attribution"
        }

        const creationAttribute = await attribution.attributeCommande(id, employe);
        const creationHistorique = await addToHistory(employe,id, type, request.body.raison || "");
        
        return response.status(200).json({
            status: "ok",
            body : {
                attribute : creationAttribute,
                historique : creationHistorique
            }
        });
    } catch(error) {
        console.log(error);
        return next(createError(400,"La commande demandée n'existe pas !"));
    }

})

export const checkAttribution = catchAsync( async function(request, response, next) {

    const id = request.body.id_commande || request.params.id;
    const employe = request.user.id_employe;

    if (!id) return next(createError(400, "Aucune commande n'a été sélectionnée"))

    const commande = await attribution.getCommandeAttribution(id);

    if (!commande) return next(createError(400, "Impossible de trouver la commande demandée"))
    if (commande.id_employe!==employe) {
        return next(createError(400, "Vous ne pouvez pas modifier une commande qui ne vous est pas attribuée"))
    }

    request.commande= commande;
    next();
})



export const appelClient = catchAsync(async function(request, response, next) {

    const result = request.body.resultat;
    const id_commande = request.params.id;

    if(!result || !id_commande) return next(createError(400, "Une information obligatoire n'a pas été fournie"))

    if(!result in ["annuler", "confirmer", "restorer"]) return next(createError(400, "Un appel client ne peut donner lieu qu'à deux résultat possible : Annuler et Confirmer"))
    
    const commande = await model.getOneCommande(id_commande)

    if (result==="annuler") {
        if (commande.id_status===9) return next(createError(400, "La commande est déjà annulée"))
        await historique.createStatus(9,id_commande, "la commande a été annulée par client");
        await historique.createHistorique(id_commande, request.user.id_employe, "changement status", "Après un appel du client, la commande a été annulée");
    } 
    if (result==="confirmer" ) {
        if (commande.id_status!==2) return next(createError(400, "Il n'est possible de confirmer une commande que si elle en status 'Attribuée' "))
        await historique.createStatus(3, id_commande, "commande confirmée par le client")
        await historique.createHistorique(id_commande, request.user.id_employe, "changement status", "Le client a confirmé sa commande.");
    }
    if (result==="restorer") {
        if (commande.id_status!==9) return next(createError(400, "Vous ne pouvez pas restorer une commande qui n'est pas annulée"))
        await historique.createStatus(3, id_commande, "commande restoré")
        await historique.createHistorique(id_commande, request.user.id_employe, "changement status", "Le client a choisi de réactiver la commande");
    }


    return response.status(200).json({
        status : "ok",
        response : "Le status de la commande a bien été modifié"
    })

})