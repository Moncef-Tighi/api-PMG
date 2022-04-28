import { catchAsync } from './errorController.js';
import * as model from '../models/article.js';
import createError from 'http-errors';


const addStockToArticles = function(articles, articlesDispo) {
    const output=[];
    for(const [code_article, stock] of Object.entries(articlesDispo)) {
        let article;
        try {
            article = articles.find(art=> art.code_article=code_article);
        } catch(error) {
            article = articles
        }
        article.stock=stock;
        //On a besoin de destructurer l'article, sinon le push le copie sur chaque case de l'array
        output.push({ ...article});
    }
    return output
}

export const listeArticle = catchAsync( async function(request, response) {
    
    const articles = await model.readAllArticles();
    const codeArticles = articles.map(article=> article.code_article)
    const disponibilite = await model.checkDisponibilite(codeArticles);

    const result = addStockToArticles(articles, disponibilite.articles);


    return response.status(200).json({
        status: "ok",
        body : result
    });

});

export const unArticle = catchAsync( async function(request, response) {

    const id = request.params.id;
    if (!id) return next(createError(400, `Impossible de trouver le code article`))
    const article = await model.readOneArticle(id);
    if (!article) return next(createError(404, `Impossible de trouver l'article demandé`));
    const disponibilite = await model.checkDisponibilite([article.code_article]);

    const result = addStockToArticles(article, disponibilite.articles);

    return response.status(200).json({
        status: 'ok',
        body : result
    });

});

export const ajoutArticle = catchAsync(async function(request, response) {
    
    const code_article= request.body.code_article;
    const libelle= request.body.libelle;
    const marque = request.body.marque;
    const type= request.body.type;
    const date_creation = request.body.date_creation;
    const prix_vente = request.body.prix_vente;
    const description = request.body.description;
    const tags = request.body.tags;
    const tailles = request.body.taille;
    if (!code_article || !tailles || !prix_vente || prix_vente<10) return next(createError(400, `Impossible de créer l'article : une information obligatoire n'a pas été fournit`))
    const result = await model.insertArticle(code_article, libelle, marque, type, date_creation, prix_vente, description, tags);

    tailles.forEach( async taille => {
        await model.insertTaille(code_article, taille.dimension, taille.code_barre)
    })
    return response.status(201).json({
        status : "ok",
        message : "L'article a bien été mis en vente sur la plateforme",
        body : result    
    })
})

export const articleEtat = catchAsync( async function(request, response) {
    //Est-ce que l'article est mis en vente sur la plateforme ? Si oui, est-il activé ?

    return response.status(200).json({
        status: 'ok',
    });

});


export const updatePrixArticle = catchAsync( async function(request, response) {
    //Utilisé pour la page comparaison de prix

    return response.status(200).json({
        status: 'ok',
    });

});

export const disableArticle = catchAsync( async function(request, response) {

    return response.status(200).json({
        status: 'ok',
    });

});

export const enableArticle = catchAsync( async function(request, response) {

    return response.status(200).json({
        status: 'ok',
    });

});


