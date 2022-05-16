import { catchAsync } from "./errorController.js";
import * as wooCommerce from '../models/wooCommerce.js';
import * as cegid from "../models/article.js";
import createError from 'http-errors';

export const updatePrixArticle = catchAsync( async function(request, response, next) {
    //Utilisé pour la page comparaison de prix

    const newPrix = request.body.prix;
    const article= request.body.code_article;
    if (!newPrix || newPrix<10 || !article) return next(createError(400, "Erreur : un prix ou un article valide n'a pas été trouvé"))
    const rowCount= await wooCommerce.updatePrix(article, newPrix);
    if (rowCount===0) return response.status(404).json({
        status: "error",
        message : "Aucun article n'a été affecté par la modification"
    })
    return response.status(200).json({
        status: 'ok',
        ligne_affecté: rowCount
    });

});

export const updateStock = catchAsync( async function(request, response, next) {

    const article= request.body.code_article;

    
    //AVEC CEGID : 
    
    // const {articles} = await cegid.checkDisponibilite([article]);
    // let result
    // if (articles[article]>=process.env.MINSTOCK) result = await wooCommerce.updateDisponibilite(article, "instock")
    // else result = await wooCommerce.updateDisponibilite(article, "outofstock");
    
    //MANUELLEMENT : 
    
    const status = request.body.status ? "instock" : "outofstock"
    const result = await wooCommerce.updateDisponibilite(article, status)

    return response.status(200).json({
        status: 'ok',
        ligne_affecté : result
    });
})