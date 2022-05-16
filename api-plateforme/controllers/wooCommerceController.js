import { catchAsync } from "./errorController.js";
import * as wooCommerce from '../models/wooCommerce.js';

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
