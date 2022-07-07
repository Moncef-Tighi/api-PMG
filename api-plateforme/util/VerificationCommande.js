import * as articles from '../models/article.js';
import axios from 'axios';

export const verifyArticleStock = async function (contenu_commande) {
    //Cette fonction vérifie que l'article existe ET qu'il est disponible dans une quantité suffisante pour effectuer la commande
    //Cette fonction est utilisé lors de la création ET de la modification d'une commande

    const code_barres = contenu_commande.map(taille => taille.code_barre);
    const stock = await axios.post(`${process.env.API_CEGID}/articles/taille?code_barre=true`, { articles: code_barres });
    if (stock.data.body.articles.length != code_barres.length)
        throw "Un des articles demandé n'existe pas";
    stock.data.body.articles.forEach(art => {
        if (art.stockNet <= process.env.MINSTOCK)
            throw `La taille demandé pour ${art.GA_CODEARTICLE} n'est plus disponible`;
        const quantite = contenu_commande.find(content => content.code_barre === art.GA_CODEBARRE).quantité;
        if (!quantite || quantite < 1)
            throw `La quantité demandé pour l'article ${art.GA_CODEARTICLE}  n'est pas valide`;
        if (art.stockNet - quantite < 0)
            throw `Il y a moins de ${quantite} pièces disponible pour l'article ${art.GA_CODEARTICLE}`;
        "Il y a moins de " + quantite + " pièces disponible pour l'article " + art.GA_CODEARTICLE;
    });
    return stock.data.body.articles;
};
export const getPrices = async function (stock) {
    //L'input de cette fonction est l'output de la fonction verifyArticleStock

    //Avant de vraiment valider l'article, il faut obtenir le prix. On ne peut pas demander le prix en paramètre
    //Parce que sinon n'importe qui pourrait demander un prix incorrect en modifiant la requête.
    //Vu que tout les articles ne sont pas sur la plateforme, on commence par chercher l'article sur la plateforme
    //Si il n'existe pas sur la plateforme on cherche le prix sur CEGID
    const codes_articles = stock.map(art => art.GA_CODEARTICLE);
    const articlesPlateforme = await articles.readArticles(codes_articles);
    const articlesHorsPlateforme = codes_articles.filter(art => !articlesPlateforme.some(article => article.code_article === art));
    //Attention ! l'API Cegid ne gère pas les prix par code_barre, juste les prix par code article. Donc l'output ne rends pas le code barre
    let prices = [];
    articlesPlateforme?.forEach(article => prices.push({ code_article: article.code_article, prix: article.prix_vente }));
    if (articlesHorsPlateforme) {
        let articlesCegid = await axios.post(`${process.env.API_CEGID}/tarifs`, { articles: articlesHorsPlateforme });
        articlesCegid = articlesCegid?.data?.body?.articles;
        Object.keys(articlesCegid)?.forEach(code_article => prices.push({ code_article, prix: articlesCegid[code_article] }));
    }
    return prices;

};
