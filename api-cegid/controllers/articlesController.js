import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';

export const listArticles = catchAsync( async function(request, response,next){

    const produits = await model.getAllArticles();
    return response.status(200).json({
        status : "ok",
        body : {
            produits,
        }
    })
});

export const detailArticle = catchAsync( async function(request, response,next){
    const produits = await model.getOneArticle(request.params.nom_produit);

    if (produits.length===0) {
        return next(createError(204,`Aucun produit avec ce nom n'a été trouvé`));
    }
    return response.status(200).json({
        status : 'ok',
        body : {
            produits,
        }
    })
});


export const ArticlesDisponible = catchAsync( async function(request, response,next){
    const produits = await model.getAllArticlesDisponibles();
    return response.status(200).json({
        status : "ok",
        body : {
            produits,
        }
    })
});

