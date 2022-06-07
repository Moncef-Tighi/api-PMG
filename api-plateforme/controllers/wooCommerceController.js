import { catchAsync } from "./errorController.js";
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
    const insertionRequests = await insertion?.map( async info=> {
        const variationInsert= variations.find(art=> art.code_article===info.code_article)
        return await apiWooCommerce.post(`products/${info.id}/variations/batch`,{
        create :  variationInsert.tailles.map(taille=>{
            return {
                stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                regular_price: String(variationInsert.prix_initial),
                sale_price: String(variationInsert.prix_vente) ,
                attributes : [{
                    id : 3,
                    option : taille.dimension
                }]
            }
        })
        })
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

const fetchCategories = async function() {
    let categories= [];
    let categorie= []
    let i=0
    while (i<1 || categorie?.data?.length>0) {
        i+=1;
        categorie = await apiWooCommerce.get(`products/categories?page=${i}&per_page=100&_fields=id,name,slug`);
        categories.push(...categorie.data);
    }
}

export const getCategorie = catchAsync(async function(request, response, next) {
    const categories= fetchCategories();

    return response.status(200).json({
        status: "ok",
        body : categories
    })

})

export const getCategorieForArticle = catchAsync(async function(request,response,next) {
    const articles = request.body.articles;
    if (!articles) return next(createError(400, "Aucun article n'a été trouvé"));
    const categories= fetchCategories();
    const articlesWooCommerce= await apiWooCommerce.get(`products?sku=${articles.map(art => art.code_article).join(',')}`)

    const articlesCategories= articlesWooCommerce.data.map(article=> {
        return {
            code_article : article.sku,
            categories : article.categories
        }
    })
    return response.status(200).json({
        status: "ok",
        body : {
            categories,
            articlesCategories
        }
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