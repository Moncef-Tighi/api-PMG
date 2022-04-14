import * as model from '../models/article.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'

export const recherche = catchAsync( async function(request, response,next){
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

    return response.render('recherche', {
        totalSize : totalSize,
        articles :  articles,
    });
});

export const unArticle = catchAsync( async function(request, response,next){
    const infoArticle = await model.infoArticle(request.params.article);
    if (infoArticle.length===0) return next(createError(404, "Aucun article avec ce code n'a été trouvé"))
    const tailles = await model.dispoArticleTaille(request.params.article);

    return response.render("article", {
        article : infoArticle[0],
        tailles,
    })
})
