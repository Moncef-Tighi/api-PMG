import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'

export const listArticles = catchAsync( async function(request, response,next){
    const [articles, length] = await model.getAllArticles(request.query);
    if (length[0]>0) {
        const codeArticle = articles.filter(article => article.GA_CODEARTICLE);
        console.log(codeArticle);
        const resultat = await model.disponibilitéArticle(codeArticle);
        console.log(resultat)
    }

    return response.status(200).json({
        status : "ok",
        length: length[0],
        body : {
            articles,
        }
    })
    
});



export const ArticlesDisponible = catchAsync( async function(request, response,next){
    if (!request.body.articles || ! request.body.articles instanceof Array) {
        return next(createError(400, "Erreur : Une liste d'article n'a pas été fournit dans le body de la requête") )
    }
    const articles = await model.getAllArticlesDisponibles();
    return response.status(200).json({
        status : "ok",
        body : {
            articles,
        }
    })
});

export const detailArticle = catchAsync( async function(request, response,next){
    // const articles = await model.getOneArticle(request.params.nom_produit);

    // if (articles.length===0) {
    //     return next(createError(204,`Aucun produit avec ce nom n'a été trouvé`));
    // }
    // return response.status(200).json({
    //     status : 'ok',
    //     body : {
    //         articles,
    //     }
    // })
});