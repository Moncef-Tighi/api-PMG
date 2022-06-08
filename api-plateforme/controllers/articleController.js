import { catchAsync } from './errorController.js';
import * as model from '../models/article.js';
import createError from 'http-errors';
import apiWooCommerce from "../models/api.js";
import db from "../models/postGreSql.js";



export const listeArticle = catchAsync( async function(request, response) {
    //EndPoint pour l'API client, on réccupère l'article depuis la plateforme et le stock depuis CEGID
    if (!request.query.activé) request.query.activé='true';

    const articles = await model.readAllArticles(request.query);
    const totalSize = articles.length
    return response.status(200).json({
        status: "ok",
        page : Number(request.query.page) || 1,
        totalSize,
        body : articles
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

    const disponibilite = await model.checkDisponibilite([article.code_article]);

    // const result = await addStockToArticles(article, disponibilite.articles);
    const WooCommerce = await apiWooCommerce.get("products", {sku : id})

    return response.status(200).json({
        status: 'ok',
        body : {
            Plateforme : disponibilite.articles,
            WooCommerce : WooCommerce.data
        }
    });

});

export const insertArticles = catchAsync(async function(request, response, next) {
    //On importe l'article depuis l'API Cegid et on le place dans la plateforme.

    const articles= request.body.articles
    
    if (!articles) return next(createError(400, `Impossible de trouver la liste d'articles`))
    try {
        db.query('BEGIN');
        const articlesResponse = await model.batchCreateArticles(articles);
        var articlesCreated = await Promise.all(articlesResponse);
        db.query("COMMIT");
    } catch(error) {
        db.query("ROLLBACK");
        throw error
    }
    try {
        db.query('BEGIN');
        const taillesResponse = await model.batchCreateTailles(articles)
        var taillesCreated = await Promise.all(taillesResponse);
        db.query("COMMIT");
    } catch(error) {
        db.query("ROLLBACK");
        throw error
    }

    return response.status(201).json({
        status : "ok",
        message : "L'article a bien été mis en vente sur la plateforme",
        body : {
            articles : articlesCreated,
            tailles : taillesCreated
        }    
    })
})

export const updateArticles = catchAsync(async function(request,response,next) {
    const articles= request.body.articles
    if (!articles) return next(createError(400, `Impossible de trouver la liste d'articles`))
    try {
        db.query('BEGIN');
        const articlesResponse = await model.batchUpdateArticles(articles);
        var articlesUpdated = await Promise.all(articlesResponse);
        db.query("COMMIT");
    } catch(error) {
        db.query("ROLLBACK");
        throw error
    }

    return response.status(201).json({
        status : "ok",
        message : "L'article a bien été mis en vente sur la plateforme",
        body : {
            articles : articlesUpdated,
        }    
    })

})

export const activateArticles = catchAsync(async function(request,response, next) {
    // ATTENTION ! Le jour ou WooCommerce sera retiré, il faudra retirer l'activation des articles côté WooCommerce
    // Actuellement on actualise côté plateforme ET côté WooCommerce.
    // Cette route est utilisé pour activer les articles après la fin de l'insertion
    const articlePlateforme= request.body.code_article;
    const articleWooCommerce= request.body.id;
    if (!articlePlateforme && !articleWooCommerce) return next(createError(400, "aucun article à activé n'a été trouvé."))
    
    if (articlePlateforme) {
        var plateforme = await model.activationArticle(articlePlateforme, true);
    }
    if (articleWooCommerce) {
        var wooCommerce = await apiWooCommerce.post("products/batch", 
        {
            update: articleWooCommerce.map(id=> {return {id, status : "publish"}})
        })
    }
    return response.status(200).json({
        status : "ok",
        body : {
            plateforme,
            wooCommerce: wooCommerce?.data?.body, 
        }    
    })
 
})


export const corbeille = catchAsync(async function(request,response,next) {
    //Cette fonction est utilisée pour faire passer des articles dans la corbeille ou les rétablir

    const code_articles= request.body.code_article;
    const status = request.body.status;
    if (!code_articles) return next(createError(400, "aucun article à activé n'a été trouvé."))
    
    const plateforme = await model.activationArticle(code_articles, status);
    const articlesWooCommerce = await apiWooCommerce.get(`products?sku=${code_articles.join(',')}`) 
    if (articlesWooCommerce.data) {
        var wooCommerce = await apiWooCommerce.post("products/batch", 
        {
            update: articlesWooCommerce.data.map(art=> {return {id : art.id, status : status ? "publish" : "draft"}})
        })
    }
    return response.status(200).json({
        status : "ok",
        body : {
            plateforme,
            wooCommerce: wooCommerce?.data?.body, 
        }    
    })

})

export const ventesArticle = catchAsync( async function(request, response) {
    // const ventes = await wooCommerce.totalVentes();

    return response.status(200).json({
        status : "ok",
        // body : ventes    
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