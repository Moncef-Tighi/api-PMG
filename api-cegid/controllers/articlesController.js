import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'

export const listArticles = catchAsync( async function(request, response,next){
    const having = {}
    if(request.query.stock) {
        having['SUM(GQ_PHYSIQUE-GQ_RESERVECLI+GQ_RESERVEFOU-GQ_PREPACLI)']=request.query.stock;
        delete request.query.stock;
    }
    const [articles, length] = await model.getAllArticles(request.query, having);

    if (articles.length===0) return (next(createError(404, 'Aucun article ne correspond à cette recherche')))
    
    const totalSize = articles[0].total;
    //TODO : L'URL sera très certainement invalide en PROD
    articles.map(article => {
        delete article.total;
        article.details = encodeURI(`http://${request.get('host')}${request.originalUrl.split('?')[0]}/${article.GA_CODEARTICLE}`);
    })

    return response.status(200).json({
        status : "ok",
        page : Number(request.query.page) || 1,
        length: length[0],
        totalSize,
        body : {
            articles,
        }
    })
    
});

export const unArticle = catchAsync(async function(request, response, next) {

    const infoArticle = await model.infoArticle(request.params.article);
    if (infoArticle.length===0) return next(createError(404, "Aucun article avec ce code n'a été trouvé"))
    const taille = await model.dispoArticleTaille(request.params.article);

    //TODO : L'URL sera très certainement invalide en PROD
    return response.status(200).json({
        status : "ok",
        codeArticlce : request.params.article,
        details_stock : encodeURI(`http://${request.get('host')}/api/v1/articles/detail_stock/${request.params.article}`),
        historiqueTarif : encodeURI(`http://${request.get('host')}/api/v1/tarifs/${request.params.article}`),
        body : {
            "info" : infoArticle[0],
            taille,
        }
    })
})


const formatResponseDepot = function(depots,taille) {

    depots[taille.GDE_LIBELLE].push({
        dimension : taille.dimension,
        stockNet : taille.stockNet,
        // transfert : taille.transfert,
        // vendu : taille.vendu,
        // stock : taille.stock,
        // ecartInventaire : taille.ecartInventaire
    });

}

export const ArticleDepot = catchAsync( async function(request, response,next){
    
    const article = await model.emplacementArticle(request.params.article);

    if (article.length===0) {
        return next(createError(404,`Aucun article avec ce code n'a été trouvé`));
    }
    
    const depots = {};
    article.forEach(taille => {
        if (taille.GDE_LIBELLE in depots) {
            formatResponseDepot(depots, taille)
        } else {
            depots[taille.GDE_LIBELLE] = [];
            formatResponseDepot(depots, taille)
        }
    })
    return response.status(200).json({
        status : 'ok',
        codeArticlce : request.params.article,
        body : {
            depots,
        }
    })
    
});

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
                if (article===code.GA_CODEARTICLE) return resultat[article] =  code['stockNet']
            })
        }
        else {
            if (article===dataRecord?.GA_CODEARTICLE) return resultat[article] =  data.recordset[0].GA_CODEARTICLE
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