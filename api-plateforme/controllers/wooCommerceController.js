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

    const updateRequests = await  update?.map( async info=> {

        const allVariations = await apiWooCommerce.get(`products/${info.id}/variations`);
        const variationUpdate= variations.find(art=> art.code_article===info.code_article)
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

    //TODO : Actuellement si il y a une erreur dans l'insertion ou l'update d'un article, l'opération continue comme si de rien n'était
    //l'API de WooCommerce s'en fout et insert ce qui peut être insérer en signalant une erreur mais sans annuler quoi que ce soit.
    //On doit faire la vérification qu'il n'y a pas eu d'erreurs après l'insert ET après l'update.

    const insertResult= await Promise.all(insertionRequests || []);
    const wooCommerceInsertVariation = insertResult?.map(promesse => promesse.data.create)

    const updateResult= await Promise.all(updateRequests || []);
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

export const getCommandes = catchAsync(async function(request, response, next) {
    const commandes = await apiWooCommerce.get(`orders?per_page=50&page=${request.query.page || 1}`)
    const commandesOutput = commandes.data.map(commande=> {
        return {
            numero_commande : commande.number,
            status : commande.status,
            prix_total : commande.total,
            informations_client : {
                nom : commande.billing.first_name,
                prenom : commande.billing.last_name,
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