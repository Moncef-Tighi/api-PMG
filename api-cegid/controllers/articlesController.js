import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'

export const listArticles = catchAsync( async function(request, response,next){
    const [articles, length] = await model.getAllArticles(request.query);
    // if (length[0]>0) {
    //     const codeArticle = articles.map(article => article.GA_CODEARTICLE);
    //     const stock = await model.disponibilitéArticle(codeArticle);
    // }

    return response.status(200).json({
        status : "ok",
        length: length[0],
        body : {
            articles,
        }
    })
    
});

export const unArticle = catchAsync(async function(request, response, next) {

    
    return response.status(200).json({
        status : "ok"
    })
})

export const ArticlesDisponible = catchAsync( async function(request, response,next){

    const articles = request.body.articles
    if (!articles || ! articles instanceof Array) {
        return next(createError(400, "Erreur : Une liste d'article n'a pas été fournit dans le body de la requête") )
    }
    const dataRecord = await model.disponibilitéArticle(articles);
    let resultat = {};
    articles.forEach(article => {
        //Ce code est complexe parce que le return de la query peut être soit : Undefined, un objet ou un array d'objet
        if (!dataRecord) return resultat[article] = 0;
        if (dataRecord instanceof Array) {
            dataRecord.forEach(code => {
                if (article===code.GL_CODEARTICLE) return resultat[article] =  code['Stock Disponible']
            })
        }
        else {
            if (article===dataRecord?.GL_CODEARTICLE) return resultat[article] =  data.recordset[0].GL_CODEARTICLE
        }
        if (!(article in resultat)) return resultat[article] = 0;
    });

    return response.status(200).json({
        status : "ok",
        body : {
            articles : resultat
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