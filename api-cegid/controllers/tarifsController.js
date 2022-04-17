import * as model from '../models/tarifs.js';
import { catchAsync } from './errorController.js';
import createError from 'http-errors'


export const derniersTarifs = catchAsync( async function(request, response, next) {

    
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