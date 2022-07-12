import { catchAsync } from './errorController.js';
import * as model from '../models/commande.js';
import * as contenu from '../models/commande_contenu.js';
import * as articles from '../models/article.js';
import * as attribution from '../models/commande_attribution.js';
import * as historique from '../models/commande_historique.js';
import { addToHistory } from './commadeHistoriqueController.js';
import createError from 'http-errors';
import { verifyArticleStock, getPrices } from '../util/VerificationCommande.js';
import axios from 'axios';


export const contenuCommande = catchAsync( async function(request,response, next) {

    const id_commande = request.params.id;

    const commande_plateforme = await contenu.contenuUneCommande(id_commande);

    if (!commande_plateforme) return next(400, "La commande demandée n'existe pas");

    //Récupération du stock actuel pour chaque article sur CEGID
    
    const code_barres = commande_plateforme.map(commande => commande.code_barre);

    //On a pas vraiment besoin de juste réccupérer le stock, on a besoin du stock dans chaque dépot
    // const stock = await axios.post(`${process.env.API_CEGID}/articles/taille?code_barre=true`, {articles : code_barres});

    const stock = await axios.post(`${process.env.API_CEGID}/articles/detail_taille`, {tailles : code_barres});

    const contenu_commande = commande_plateforme.map(commande => {
        return {
            ...commande,
            emplacement : stock.data["tailleDépot"].reduce((result, taille)=> {
                if (taille.code_barre===commande.code_barre) {
                    return result.concat({
                        depot :  taille.depot,
                        stock : taille.stockNet
                    })
                }
                return result;
            }, [])
        }
    })


    return response.status(200).json({
        status: "ok",
        contenu_commande,
    });

})


export const addToCommandeContenu = catchAsync( async function(request, response, next) {
    
    const id_commande = request.params.id;
    const newArtilce = request.body.code_barre
    const quantite = request.body.quantite;
    const raison = request.body.raison;
    
    if (!id_commande ) return next(createError(400, "Vous n'avez pas fournit la commande ciblée"))
    if (!newArtilce ) return next(createError(400, "Le contenu de la commande est invalide"))
    if (!quantite || quantite<1) return next(createError(400, "La quantité de l'article demandé n'est pas valide"))

    //Il faut vérifier si l'article demandé est déjà dans la commande, et return une erreur si c'est le cas

    const commande = await contenu.contenuUneCommande(id_commande);
    
    if (!commande) return next(createError(400, "La commande n'existe pas"))
    if (commande.some(article=> article.code_barre===newArtilce)) return next(createError(400, "L'article à ajouter est déjà dans la commande"))

    try {
        var stock = await verifyArticleStock([{code_barre : newArtilce, quantité : quantite}]);
    } catch(error) {
        //Ici, si le stock est trop faible la commande ne passe pas.
        //Mais il pourrait y avoir un cas ou un employé veut faire passer une commande pour un article hors stock
        //TODO : permettre ça en ne vérifiant que si le code barre existe bien, pas le stock de l'article
        return next(createError(400, error))
    }

    const prices = await getPrices(stock);
    
    const result = await contenu.addArticleToCommand(id_commande,newArtilce, quantite,
        prices.find(price => 
            price.code_article === stock.find(art=> art.GA_CODEBARRE===newArtilce).GA_CODEARTICLE
        ).prix
    )

    await addToHistory(request.user.id_employe, id_commande, "Ajout au contenu", raison || ""
    , `La taille ${newArtilce} a été ajouté au contenu de la commande`)

    return response.status(201).json({
        status: "ok",
        commande : result
    });
});

export const removeFromCommandeContenu = catchAsync( async function(request, response, next) {
    
    const id_commande = request.params.id;
    const article = request.body.code_barre
    const raison = request.body.raison;

    if (!id_commande || !article) return next(createError(400, "Une information nécessaire n'a pas été fournie"))

    //Il faut vérifier que l'article est bien dans la commande ET si la commande n'est pas vide.
    //Il faut empêcher l'employé de vider une commande, c'est pas ouf comme UX sur certains points
    //Mais ça évite une erreur humaine où tu supprimes les articles d'une commande sans les réajouter ensuite

    const contenu_commande = await contenu.contenuUneCommande(id_commande);

    if (!contenu_commande) 
        return next(createError(400, "La commande n'existe pas"))
    if (!contenu_commande.some(art=> art.code_barre===article)) 
        return next(createError(400, `L'article que vous voulez supprimer n'est pas dans le contenu de la commande`))
    if (contenu_commande.length<2) 
        return next(createError(400, `Le contenu d'une commande ne peut pas être vide,impossible d'effectuer la supression`))

    await contenu.removeArticleFromCommande(id_commande, article)    

    await addToHistory(request.user.id_employe, id_commande, "Supression du contenu", raison || ""
    , `La taille ${article} a été retiré du contenu de la commande`)


    return response.status(200).json({
        status: "ok",
        message: "L'article a bien été retiré de la commande "
    });

});

export const changeQuantity = catchAsync( async function(request, response, next) {
    
    const id_commande = request.params.id;
    const article = request.body.code_barre
    const quantite = request.body.quantite;
    const raison = request.body.raison;

    if (!id_commande || !article || !quantite) return next(createError(400, "Une information nécessaire n'a pas été fournie"))

    const commande = await contenu.contenuUneCommande(id_commande);

    if (!commande) return next(createError(400, "La commande n'existe pas"))

    try {
        var stock = await verifyArticleStock([{code_barre : article, quantité : quantite}]);
    } catch(error) {
        //Ici, si le stock est trop faible la commande ne passe pas.
        //Mais il pourrait y avoir un cas ou un employé veut faire passer une commande pour un article hors stock
        //TODO : permettre ça en ne vérifiant que si le code barre existe bien, pas le stock de l'article
        return next(createError(400, error))
    }
    
    const result = await contenu.updateQuantiteCommande(id_commande, article, quantite)

    await addToHistory(request.user.id_employe, id_commande, "Changement quantité", raison || ""
    , `L'article ${article} a vu sa quantité passer de ${commande[0].quantite} à ${quantite}`)

    
    return response.status(200).json({
        status: "ok",
        commande : result
    });

});


