import { catchAsync } from './errorController.js';
import * as model from '../models/article.js';
import createError from 'http-errors';
import * as wooCommerce from '../models/wooCommerce.js';
import apiWooCommerce from "../models/api.js";

const extractArticle= function(body) {
    const code_article= body.code_article;
    const libelle= body.libelle;
    const marque = body.marque;
    const date_modification = body.date_modification;
    const prix_vente = body.prix_vente;
    const prix_initial = body.prix_initial;
    const description = body.description;
    const tailles = body.taille;
    const gender = body.gender;
    const division = body.division;
    const silhouette = body.silhouette;
    const categorie= body.categorie;
    return {code_article,libelle,marque,date_modification,prix_vente,prix_initial, description, tailles
        ,gender,division,silhouette, categorie}
}


const insertOneArticlePlateforme= async function(body, id, variation) {

    const {code_article,libelle,marque,date_modification,prix_vente,prix_initial, description, tailles
    , gender, division, silhouette} = extractArticle(body);
    
    const result = await model.insertArticle(code_article, libelle, marque, date_modification,
        gender, division, silhouette ,prix_initial, prix_vente, description,id);
    tailles.forEach( async taille => {
        await model.insertTaille(code_article, taille.dimension, taille.code_barre, taille.stock,
            variation.find(art=> art.taille===taille.dimension)?.id)
    })

    return {result};
}

const insertOneArticleWooCommerce= async function(body) {
    const {code_article,libelle,prix_vente,prix_initial, tailles, categorie} = extractArticle(body);

    const wooCommerce = await apiWooCommerce.post("products",{
        name : libelle,
        type: "variable",
        regular_price: String(prix_initial),
        sale_price: String(prix_vente) ,
        sku: code_article,
        stock_status: "instock",
        attributes : [{
            id : 3,
            variation : true,
            visible: true,
            options :  tailles.map(dim => dim.dimension)
        }
        ],
        categories : categorie?.map(cat=> {return {"id" : cat}}) || []
    })
    const wooCommerceVariations = await apiWooCommerce.post(`products/${wooCommerce.data.id}/variations/batch`,{
        create :  tailles.map(taille=>{
            return {

                stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                regular_price: String(prix_initial),
                sale_price: String(prix_vente) ,
                attributes : [{
                    id : 3,
                    option : taille.dimension
                }]
            }
        })
        })

    return {wooCommerce, wooCommerceVariations}

}

const updateOnearticleWooCommerce = async function(body,id) {
    const {libelle,prix_vente, tailles,categorie} = extractArticle(body);
    const wooCommerce = await apiWooCommerce.put(`products/${id}`,{
        sale_price: String(prix_vente),
        date_modified: Date.now(),
        name : libelle,
        categories : categorie.map(cat=> {return {"id" : cat}})
    });

    const allVariations = await apiWooCommerce.get(`products/${id}/variations`);

    const wooCommerceVariations = await apiWooCommerce.post(`products/${id}/variations/batch`,{
        update :  tailles.map(taille=>{
            return {
                id : allVariations.data.find(article => article.attributes[0]?.option===taille.dimension).id,
                stock_status: taille.stock > process.env.MINSTOCK ? "instock" : "outofstock", 
                regular_price: String(prix_vente),
            }
        })
        })

    return  {wooCommerce, wooCommerceVariations}
}


const addStockToArticles = async function(articles, articlesDispo) {
    //Fonction utilitaire qui combine les infos de l'article extraite de la plateforme 
    //Avec les informations de stock extraite de l'API Cegid
    const output=[];
    for(const [code_article, stock] of Object.entries(articlesDispo)) {
        let article;
        try {
            article = articles.find(art=> art.code_article===code_article);
        } catch(error) {
            article = articles
        }

        if (stock>=process.env.MINSTOCK) await wooCommerce.updateDisponibilite(code_article, "instock")
        else await wooCommerce.updateDisponibilite(code_article, "outofstock")
        article.stock=stock;
        //On a besoin de destructurer l'article, sinon le push le copie sur chaque case de l'array au lieu de le mettre à la fin
        output.push({ ...article});
    }
    return output
}

export const listeArticle = catchAsync( async function(request, response) {
    //EndPoint pour l'API client, on réccupère l'article depuis la plateforme et le stock depuis CEGID

    const articles = await model.readAllArticles(request.query);
    const codeArticles = articles.map(article=> article.code_article);
    const disponibilite = await model.checkDisponibilite(codeArticles);

    const result = await addStockToArticles(articles, disponibilite.articles);


    return response.status(200).json({
        status: "ok",
        body : result
    });

});

export const unArticle = catchAsync( async function(request, response, next) {
    //EndPoint pour l'API client, on réccupère l'article depuis la plateforme et le stock depuis CEGID

    const id = request.params.id;
    if (!id) return next(createError(400, `Impossible de trouver le code article`))
    const article = await model.readOneArticle(id);
    if (!article) return response.status(200).json({
        status: 'ok',
        message : "Aucun article n'a été trouvé",
        body : []
    });
;
    const disponibilite = await model.checkDisponibilite([article.code_article]);

    const result = await addStockToArticles(article, disponibilite.articles);
    const WooCommerce = await apiWooCommerce.get("products", {sku : id})

    return response.status(200).json({
        status: 'ok',
        body : {
            Plateforme : result,
            WooCommerce : WooCommerce.data
        }
    });

});

export const ajoutArticle = catchAsync(async function(request, response, next) {
    //On importe l'article depuis l'API Cegid et on le place dans la plateforme.
    
    const {code_article,prix_vente, tailles} = extractArticle(request.body);

    if (!code_article || !tailles || !prix_vente || prix_vente<10) return next(createError(400, `Impossible de créer l'article : une information obligatoire n'a pas été fournit`))

    const wooCommerceExistance= await apiWooCommerce.get(`products?sku=${code_article}`);
    if (wooCommerceExistance.data[0]?.name) {
        var {wooCommerce, wooCommerceVariations} = await updateOnearticleWooCommerce(request.body,wooCommerceExistance.data[0].id);
    } else {

        var {wooCommerce, wooCommerceVariations} = await insertOneArticleWooCommerce(request.body);
    }

    //L'ajout des l'ID de la variation sur WooCommerce avec deux options de paramètres c'est un peu bizarre comme logique
    //Mais c'est obligé parce que parfois la réponse va être un create et parfois un update.
    //Sauf que pour une meilleur UX on garde aucune différence entre les deux.

    const result = await insertOneArticlePlateforme(request.body, wooCommerce.data.id,
        wooCommerceVariations.data?.create?.map(variation=> {
            return {
                id : variation.id,
                taille : variation.attributes[0].option
            }
        }) || wooCommerceVariations.data.update.map(variation=> {
            return {
                id : variation.id,
                taille : variation.attributes[0].option
            }
        })
        );



    return response.status(201).json({
        status : "ok",
        message : "L'article a bien été mis en vente sur la plateforme",
        body : {
            plateforme : result,
            wooCommerce : wooCommerce.data,
            wooCommerceVariations : wooCommerceVariations.data
        }    
    })
})

export const ventesArticle = catchAsync( async function(request, response) {
    const ventes = await wooCommerce.totalVentes();

    return response.status(200).json({
        status : "ok",
        body : ventes    
    })
})

export const articleEtat = catchAsync( async function(request, response, next) {
    //Requête utilisé côté plateforme
    //Est-ce que l'article est mis en vente sur la plateforme ? Si oui, est-il activé ? Si il est activé, est-il en stock ?

    const articles = request.body.articles;
    if (!articles || ! articles instanceof Array) {
        return next(createError(400, "Erreur : Une liste d'article n'a pas été fournit dans le body de la requête") )
    }
    const codeArticles = articles.map(article=> article.code_article);
    
    const articlesPlateforme = await model.readArticles(codeArticles);
    let result = []
    articles.forEach(article=> {
        let output={};
        const found = articlesPlateforme.find(art=> art.code_article === article.code_article);

        if (found) {
            if (found["activé"]===false) output = {code_article : article.code_article, status : "Désactivé"}
            else if (article.stock<3) output = {code_article : article.code_article, status : "Hors Stock"}
            else output = {code_article : article.code_article, status : "En Vente"}
        }
        else output = {code_article : article.code_article, status : "CEGID"}
        result.push(output);
    })
    return response.status(200).json({
        status: 'ok',
        body : result
    });

});


export const updatePrixArticle = catchAsync( async function(request, response, next) {
    //Utilisé pour la page comparaison de prix

    const newPrix = request.body.prix;
    const article= request.body.code_article;
    if (!newPrix || newPrix<10 || !article) return next(createError(400, "Erreur : un prix ou un article valide n'a pas été trouvé"))
    const rowCount= await model.updatePrix(article, newPrix);
    if (rowCount===0) return response.status(404).json({
        status: "error",
        message : "Aucun article n'a été affecté par la modification"
    })
    await wooCommerce.updatePrix(article, newPrix);
    return response.status(200).json({
        status: 'ok',
        ligne_affecté: rowCount
    });

});


export const disableArticle = catchAsync( async function(request, response) {
    const code_article = request.params.id
    const resultat = await model.activationArticle(code_article, false);

    return response.status(200).json({
        status: 'ok',
        resultat
    });


});

export const enableArticle = catchAsync( async function(request, response) {
    const code_article = request.params.id
    const resultat = await model.activationArticle(code_article, true);

    return response.status(200).json({
        status: 'ok',
        resultat
    });

});