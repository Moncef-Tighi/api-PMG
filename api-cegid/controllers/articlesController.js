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
        page : Number(request.query.page) || 1,
        length: length[0],
        body : {
            articles,
        }
    })
    
});

export const unArticle = catchAsync(async function(request, response, next) {

    const infoArticle = await model.infoArticle(request.params.article);
    
    if (infoArticle.length===0) return next(createError(404, "Aucun article avec ce code n'a été trouvé"))

    const taille = await model.dispoArticleTaille(request.params.article);

    return response.status(200).json({
        status : "ok",
        codeArticlce : request.params.article,
        "Détails" : infoArticle,
        body : {
            taille,
        }
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

const formatResponseDepot = function(depots,taille) {
    depots[taille.GDE_LIBELLE].push({
        "Dimension" : taille.Dimension,
        "Stock Net" : taille["Stock Net"],
        "Transfert" : taille.Qte_TRANSFERT,
        "Vendu" : taille.QTE_VENDU,
        "Stock" : taille.Qte_Stock,
        'Ecart Inventaire' : taille.GQ_ECARTINV
    });
}
export const ArticleDepot = catchAsync( async function(request, response,next){
    
    
    const article = await model.emplacementArticle(request.params.article);

    if (article.length===0) {
        return next(createError(204,`Aucun article avec ce code n'a été trouvé`));
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
        body : {
            depots,
        }
    })
});