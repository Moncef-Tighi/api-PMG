import * as model from '../models/tarifs.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'


export const derniersTarifs = catchAsync( async function(request, response, next) {
    
    const articles = request.body.articles
    if (!articles || ! articles instanceof Array) {
        return next(createError(400, "Erreur : Une liste d'article n'a pas été fournit dans le body de la requête") )
    }
    const dataRecord = await model.tarifsArticles(articles);
    // let resultat = {};
    // articles.forEach(article => {
    //     //Ce code est complexe parce que le return de la query peut être soit : Undefined, un objet ou un array d'objet
    //     if (!dataRecord) return resultat[article] = 0;
    //     if (dataRecord instanceof Array) {
    //         dataRecord.forEach(code => {
    //             if (article===code.GA_CODEARTICLE) return resultat[article] =  code['stockNet']
    //         })
    //     }
    //     else {
    //         if (article===dataRecord?.GA_CODEARTICLE) return resultat[article] =  data.recordset[0].GA_CODEARTICLE
    //     }
    //     if (!(article in resultat)) return resultat[article] = 0;
    // });
    return response.status(200).json({
        status : "ok",
        body : {
            tarifs : dataRecord
        }
    })

    
})


export const historiqueTarif = catchAsync( async function(request, response,next){

    if (!request.params.article) return next(createError(204,`Aucun code article n'a été fournit en paramètre`));

    const tarifs = await model.articleAllTarifs(request.params.article);

    if (tarifs.length===0) {
        return next(createError(204,`Aucun article avec ce code n'a été trouvé`));
    }

    return response.status(200).json({
        status : "ok",
        body : {
            tarifs,
        }
    })

})