import { catchAsync } from './errorController.js';
import * as model from '../models/article.js';
import createError from 'http-errors';
import * as wooCommerce from '../models/wooCommerce.js';

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
    if (!article) return next(createError(404, `Impossible de trouver l'article demandé`));
    const disponibilite = await model.checkDisponibilite([article.code_article]);

    const result = await addStockToArticles(article, disponibilite.articles);

    return response.status(200).json({
        status: 'ok',
        body : result
    });

});

export const ajoutArticle = catchAsync(async function(request, response) {
    //On importe l'article depuis l'API Cegid et on le place dans la plateforme.
    
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
        console.log(article);
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