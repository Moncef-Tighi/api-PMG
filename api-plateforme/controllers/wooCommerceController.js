import { catchAsync } from "./errorController.js";
import * as cegid from "../models/article.js";
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";


export const insertArticlesWooCommerce = catchAsync( async function(request, response, next) {
    const articles = request.body.articles
    if (!articles) return(next(createError(400,'Impossible de trouver les articles dans le body de la requête')))

    const wooCommerceExistance= await apiWooCommerce.get(`products?sku=${articles.map(article => article.code_article).join(',')}`);

    const updateArticles = articles.filter(article => wooCommerceExistance.data?.find(art => art?.sku === article?.code_article))
    const insertArticles = articles.filter(article=> !updateArticles.some(art=> art.code_article===article.code_article));

    const data = {
        create : insertArticles?.map(article=>{
            return {
                name : article.libelle,
                type: "variable",
                regular_price: String(article.prix_initial),
                sale_price: String(article.prix_vente) ,
                sku: article.code_article,
                stock_status: "instock",
                status: "draft",
                attributes : [{
                    id : 3,
                    variation : true,
                    visible: true,
                    options :  article.tailles.map(dim => dim.dimension)
                }],
                categories : article?.categorie?.map(cat=> {return {"id" : cat}}) || []
            }}),
        update : updateArticles?.map(article=> {
            return {
                id: article.id_article_WooCommerce,
                default_attributes: {
                sale_price: String(article.prix_vente),
                date_modified: Date.now(),
                name : article.libelle,
                categories : article.categorie ? article.categorie.map(cat=> {return {"id" : cat}}) : []
        }}
    })}
    const creationWooCommerce = await apiWooCommerce.post('products/batch', data)

    //TODO : Actuellement si il y a une erreur dans l'insertion ou l'update d'un article, l'opération continue comme si de rien n'était
    //l'API de WooCommerce s'en fout et insert ce qui peut être insérer en signalant une erreur mais sans annuler quoi que ce soit.

    return response.status(201).json({
        status: "ok",
        message : "Les articles ont bien étés ajoutés sur la plateforme",
        body : {
            insertion : creationWooCommerce.data?.create?.filter(article=> !article.error)
            ?.map(article=> {return{id : article.id, code_article : article.sku}}),
            update : creationWooCommerce.data?.update?.filter(article=> !article.error)
            ?.map(article=> {return{id : article.id, code_article : article.sku}})
        }
    })
})

export const insertTailleWooCommerce = catchAsync( async function(request, response, next) {

    const update= request.body.update;
    const insertion= request.body.insertion;
    const variations = request.body.variations;

    if (!update && !insertion) return next(createError(400, "Aucune taille n'a été insérée ou modifiée sur WooCommerce"))

    // ATTENTION ! Si l'inseriton a lieu plusieurs fois au lieu d'update, les tailles vont se répéter
    const insertionRequests = await insertion.map( async info=> {
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{
        create :  variations[info.code_article].tailles.map(taille=>{
            return {
                stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                regular_price: String(variations[info.code_article].prix_initial),
                sale_price: String(variations[info.code_article].prix_vente) ,
                attributes : [{
                    id : 3,
                    option : taille.dimension
                }]
            }
        })
        })
    })
    
    const updateRequests = await  update.map( async info=> {
        const allVariations = await apiWooCommerce.get(`products/${info.id}/variations`);
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{
        update :  variations[info.code_article].tailles.map(taille=>{
                return {
                    id : allVariations.data.find(article => {
                        return article.attributes[0].option===taille.dimension
                    }).id,
                    stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                    regular_price: String(variations[info.code_article]),
                }
            }
        )})
    })

    //TODO : Actuellement si il y a une erreur dans l'insertion ou l'update d'un article, l'opération continue comme si de rien n'était
    //l'API de WooCommerce s'en fout et insert ce qui peut être insérer en signalant une erreur mais sans annuler quoi que ce soit.

    const insertResult= await Promise.all(insertionRequests);
    const wooCommerceInsertVariation = insertResult?.map(promesse => promesse.data.create)

    const updateResult= await Promise.all(updateRequests);
    const wooCommerceUpdateVariation = updateResult?.map(promesse => promesse.data.update)


    // console.log(wooCommerceUpdateVariation.data)
    return response.status(201).json({
        status: "ok",
        message : "Les articles ont bien étés ajoutés sur la plateforme",
        body : {
            insertion : wooCommerceInsertVariation,
            update : wooCommerceUpdateVariation
        }
    })

})

export const getCategorie = catchAsync(async function(request, response, next) {
    let categories= [];
    let categorie= []
    let i=0
    while (i<1 || categorie?.data?.length>0) {
        i+=1;
        categorie = await apiWooCommerce.get(`products/categories?page=${i}&per_page=100&_fields=id,name,slug`);
        categories.push(...categorie.data);
    }

    return response.status(200).json({
        status: "ok",
        body : categories
    })

})

// export const updatePrixArticle = catchAsync( async function(request, response, next) {
//     //Utilisé pour la page comparaison de prix

//     const newPrix = request.body.prix;
//     const article= request.body.code_article;
//     if (!newPrix || newPrix<10 || !article) return next(createError(400, "Erreur : un prix ou un article valide n'a pas été trouvé"))
//     const rowCount= await wooCommerce.updatePrix(article, newPrix);
//     if (rowCount===0) return response.status(404).json({
//         status: "error",
//         message : "Aucun article n'a été affecté par la modification"
//     })
//     return response.status(200).json({
//         status: 'ok',
//         ligne_affecté: rowCount
//     });

// });

// export const updateStock = catchAsync( async function(request, response, next) {

//     const article= request.body.code_article;

    
//     //AVEC CEGID : 
    
//     // const {articles} = await cegid.checkDisponibilite([article]);
//     // let result
//     // if (articles[article]>=process.env.MINSTOCK) result = await wooCommerce.updateDisponibilite(article, "instock")
//     // else result = await wooCommerce.updateDisponibilite(article, "outofstock");
    
//     //MANUELLEMENT : 
    
//     const status = request.body.status ? "instock" : "outofstock"
//     const result = await wooCommerce.updateDisponibilite(article, status)

//     return response.status(200).json({
//         status: 'ok',
//         ligne_affecté : result
//     });
// })