import { catchAsync } from "./errorController.js";
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";
import * as model from '../models/article.js'
import { marques_id } from "../models/api.js";
import axios from "axios";


//ATTENTION ! IL FAUT MODIFIER MANUELLE L'ID. Si il y a un crash dans les variations c'est à cause de ça
//L'id corresponds à celui de l'attribut taille dans wooCommerce
const id_taille_WooCommerce= 3



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
                    id : id_taille_WooCommerce,
                    variation : true,
                    visible: true,
                    options :  article.tailles.map(dim => dim.dimension)
                }],
                categories : article?.categorie?.map(cat=> {return {"id" : cat}}) || []
            }}),
        update : updateArticles?.map(article=> {
            return {
                id: wooCommerceExistance.data.find(art=> art.sku===article.code_article).id,
                default_attributes: {
                sale_price: String(article.prix_vente),
                date_modified: Date.now(),
                name : article.libelle,
                categories : article.categorie ? article.categorie.map(cat=> {return {"id" : cat}}) : []
        }}
    })}
    const creationWooCommerce = await apiWooCommerce.post('products/batch', data)

    //Ces deux lignes sont bizarre mais elles sont nécessaire pour l'error handeling
    //Si la création d'un article parmis la liste d'articles crées échoue ce n'est pas toute l'opération qui échoue
    //C'est juste la création de cet article là qui est return sous forme d'erreur.
    //DONC de mon côté il faut trouver cette erreur et la signaler pour arrêter l'opération 

    if (creationWooCommerce.data?.create?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu à la création`));
    if (creationWooCommerce.data?.update?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu lors de l'update`));

    //On update l'id des articles sur la plateforme pour pouvoir les update au besoin
    creationWooCommerce.data?.create?.forEach(async (art)=> await model.update_id_wooCommerce(art.sku, art.id ))
    creationWooCommerce.data?.update?.forEach(async (art)=> await model.update_id_wooCommerce(art.sku, art.id ))
    

    //Ajout des brands aux articles
    //On a besoin de le faire séparément parce que les brands sont un module (payants)
    if (marques_id) {
        creationWooCommerce.data?.create?.forEach(async(art)=> {
            const article = insertArticles.find(inserted => inserted.code_article===art.sku);
            const id = marques_id.data.find(marque => marque?.slug===article?.marque?.toLowerCase())?.id
            if (id) await apiWooCommerce.put(`products/${art.id}`, {brands: [id]})
        })
    }
    
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

export const updateArticleWooCommerce = catchAsync(async function(request,response,next) {
    const articles = request.body.articles
    if (!articles) return next(createError(400,'Impossible de trouver les articles dans le body de la requête'))

    const wooCommerceExistance= await apiWooCommerce.get(`products?sku=${articles.map(article => article.code_article).join(',')}`);

    if (!wooCommerceExistance) return next(createError(400, `Aucun article a modifié n'a été trouvé sur wooCommerce`))
    let warn = ""
    if (wooCommerceExistance.data.length!=articles.length) warn= `Certains articles ont étés retirés sur WooCommerce sans être retirés sur la plateforme`

    const updateArticles = articles.filter(article => wooCommerceExistance.data?.find(art => art?.sku === article?.code_article))

    const data = {
        update : updateArticles?.map(article=> {
            return {
                id: wooCommerceExistance.data.find(art=> art.sku===article.code_article).id,
                default_attributes: {
                sale_price: String(article.prix_vente),
                date_modified: Date.now(),
                name : article.libelle,
                categories : article.categorie ? article.categorie.map(cat=> {return {"id" : cat}}) : []
        }}
    })}
    const updateWooCommerce = await apiWooCommerce.post('products/batch', data)

    //Voir l'insertion plus haut pour une idée du rôle que joue cette ligne

    if (updateWooCommerce.data?.update?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu lors de l'update`));

    return response.status(201).json({
        status: "ok",
        message : "Les articles ont bien étés modifiés",
        warn,
        body : {
            update : updateWooCommerce.data?.update?.filter(article=> !article.error)
            ?.map(article=> {return{id : article.id, code_article : article.sku}})
        }
    })
})

export const insertTailleWooCommerce = catchAsync( async function(request, response, next) {

    const update= request.body.update;
    const insertion= request.body.insertion;
    const variations = request.body.variations;

    if (!update && !insertion) return next(createError(400, "Aucune taille n'a été insérée ou modifiée sur WooCommerce"))

    //Si une taille n'existe pas sur wooCommerce, il faut l'ajouter avant de pouvoir ajouter la taille de l'article
    const liste_taille_woocommerce = await apiWooCommerce.get(`products/attributes/${id_taille_WooCommerce}/terms?per_page=100`)
    if (liste_taille_woocommerce.headers["x-wp-totalpages"]>1) {
        const page2 = await apiWooCommerce.get(`products/attributes/${id_taille_WooCommerce}/terms?per_page=100&page=2`)
        liste_taille_woocommerce.data.push(...page2.data);
    }
    if (liste_taille_woocommerce.headers["x-wp-totalpages"]>2) {
        const page3 = await apiWooCommerce.get(`products/attributes/${id_taille_WooCommerce}/terms?per_page=100&page=3`)
        liste_taille_woocommerce.data.push(...page3.data);
    }


    // ATTENTION ! Si l'inseriton a lieu plusieurs fois au lieu d'update, les tailles vont se répéter
    const insertionRequests = await insertion?.map( async info=> {
        const variationInsert= variations.find(art=> art.code_article===info.code_article)
        
        const variationsListPromise = {
            create :  variationInsert.tailles.map(async taille=>{
                if (!liste_taille_woocommerce.data.some(attribut=> attribut.name===taille.dimension)) {
                    await apiWooCommerce.post(`products/attributes/${id_taille_WooCommerce}/terms`, {name : taille.dimension})
                }
                return {
                    stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                    regular_price: String(variationInsert.prix_initial),
                    sale_price: String(variationInsert.prix_vente) ,
                    attributes : [{
                        id : id_taille_WooCommerce,
                        name : "Taille",
                        option : taille.dimension
                    }]
                }
            })
        }
        const variationsList = await Promise.all(variationsListPromise.create)
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{create : variationsList} )
    })
    const updateRequests = await update?.map( async info=> {

        const allVariations = await apiWooCommerce.get(`products/${info.id}/variations`);
        const variationUpdate= variations?.find(art=> art.code_article===info.code_article)
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{
        update :  variationUpdate.tailles.map(taille=>{
                return {
                    id : allVariations.data.find(article => {
                        return article.attributes[0].option===taille.dimension
                    })?.id,
                    stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                    regular_price: String(variationUpdate.prix_vente),
                }
            }
        )})
    })
    
    const insertResult= await Promise.all(insertionRequests || []);
    const wooCommerceInsertVariation = insertResult?.map(promesse => promesse.data.create)

    const updateResult= await Promise.all(updateRequests || []);
    const wooCommerceUpdateVariation = updateResult?.map(promesse => promesse.data.update)

    //On ajoute les ID des articles sur la plateforme pour pouvoir update leur stock
    wooCommerceInsertVariation[0]?.forEach(async art=> await model.update_id_taille_wooCommerce(art.sku,  art.attributes[0]?.option, art.id ))
    wooCommerceUpdateVariation[0]?.forEach(async art=> await model.update_id_taille_wooCommerce(art.sku, art.attributes[0]?.option, art.id ))
    
    //Ces deux lignes sont bizarre mais elles sont nécessaire pour l'error handeling
    //Si la création d'une variation parmis toute les variations échoue ce n'est pas toute l'opération qui échoue
    //C'est juste la création de cet article là qui est return sous forme d'erreur. 
    //Sauf que moi j'ai besoin d'annuler l'opération à la moindre erreur pour éviter toute incohérence
    //DONC de mon côté il faut trouver cette erreur et la signaler pour arrêter l'opération 

    if (wooCommerceInsertVariation[0]?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu lors de la création d'une variation`));
    if (wooCommerceUpdateVariation[0]?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu lors de l'update d'une variation`));

    return response.status(201).json({
        status: "ok",
        message : "Les articles ont bien étés ajoutés sur la plateforme",
        body : {
            insertion : wooCommerceInsertVariation,
            update : wooCommerceUpdateVariation
        }
    })

})

export const updateTailleWooCommerce = catchAsync( async function(request, response, next) {

    const update= request.body.update;
    const variations = request.body.variations;

    if (!update) return next(createError(400, "Aucune taille à modifier sur WooCommerce"))

    const updateRequests = await update?.map( async info=> {

        const allVariations = await apiWooCommerce.get(`products/${info.id}/variations`);
        const variationUpdate= variations?.find(art=> art.code_article===info.code_article)
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{
        update :  variationUpdate.tailles.map(taille=>{
                return {
                    id : allVariations.data.find(article => {
                        return article.attributes[0].option===taille.dimension
                    })?.id,
                    stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                    regular_price: String(variationUpdate.prix_vente),
                }
            }
        )})
    })
    
    const updateResult= await Promise.all(updateRequests || []);
    const wooCommerceUpdateVariation = updateResult?.map(promesse => promesse.data.update)
    if (wooCommerceUpdateVariation[0]?.some(art => art.error)) return next(createError(400, `Une erreur a eu lieu lors de l'update d'une variation`));

    return response.status(201).json({
        status: "ok",
        message : "Les articles ont bien étés modifiés sur la plateforme",
        body : {
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

export const getCategorieForArticle = catchAsync(async function(request,response,next) {
    const articles = request.body;
    if (!articles) return next(createError(400, "Aucun article n'a été trouvé"));
    const articlesWooCommerce= await apiWooCommerce.get(`products?sku=${articles.join(',')}`)

    const articlesCategories= articlesWooCommerce.data.map(article=> {
        return {
            code_article : article.sku,
            categories : article.categories
        }
    })
    return response.status(200).json({
        status: "ok",
        body : articlesCategories
    })

})


export const getCommandes = catchAsync(async function(request, response, next) {
    const commandes = await apiWooCommerce.get(`orders?per_page=50&page=${request.query.page || 1}`)
    const commandesOutput = commandes.data.map(commande=> {
        return {
            numero_commande : commande.number,
            status : commande.status,
            prix_total : commande.total,
            informations_client : {
                nom : commande.billing.last_name,
                prenom : commande.billing.first_name,
                email : commande.billing.email,
                numero_telephone : commande.billing.phone,
                ville : commande.billing.city,
                wilaya : commande.billing.state,
                addresse_1 : commande.billing.address_1,
                addresse_2 : commande.billing.address_2,
            },
            date_commande : commande.date_created,
            date_modification : commande.date_modified,
            contenu_commande : commande.line_items.map(item=> {return {
                code_article : item.sku,
                label : item.parent_name,
                prix_unitaire : item.price,
                quantite: item.quantity,
                total : item.total,
                taille : item?.meta_data[0]?.display_value,
            }})
        }
    })
    return response.status(200).json({
        status: "ok",
        page : Number(request.query.page) || 1,
        length : commandesOutput.length,
        totalSize : Number(commandes.headers["x-wp-total"]),
        commandes : commandesOutput
    })
})