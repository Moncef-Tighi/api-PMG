import  {AsyncTask} from 'toad-scheduler';
import axios from 'axios';
import db from './models/postGreSql.js';
import { updateStockTaille } from './models/article.js';
import apiWooCommerce from './models/api.js';

export const autoUpdateStock = new AsyncTask('simple task', async ()=> {
    //TOUTE LES X MINUTES CETTE FONCTION EST EXECUTEE POUR METTRE A JOUR LE STOCK COTE PLATEFORME 
    //Le but est de garder le stock à jour sur la plateforme pour qu'elle puisse servir de source de vérité
    //Aux autres applications qui ont besoin du stock.

    //WooCommerce ne gère pas le stock, on lui envoie juste instock ou outofstock au besoin.
    //Pour pouvoir envoyer ça il faut un algorithme qui va chercher si il y a eu un changement dans le status de l'article
    //Et envoyer une requête si c'est le cas

    console.log("---- New Update ----");
    const code_article = await articleAyantChange();
    console.log("Nombre d'articles ayant changés : ")
    console.log(code_article.length);
    if (!code_article) return;
    const articlesInPlateforme= await findArticles(code_article)
    console.log("Articles sur la plateforme ayant changé :")
    console.log(articlesInPlateforme);
    if (!articlesInPlateforme) return;
    const stockArticles = await findStockArticle(articlesInPlateforme);
    const update = await updateStockTaille(stockArticles);
    console.log("Nouveau stock : ");
    console.log(update);
    const updateWooCommerce = articlesInPlateforme.filter(article => {
        return update.find(articleUpdate => article.code_article===articleUpdate.code_article 
            && article.disponible!=articleUpdate.disponible);
    })

    if (updateWooCommerce.length>0) {
        console.log("wooCommerce, articles qui doivent changer : ")
        console.log(updateWooCommerce);
        const verifyArticles = new Set();
        updateWooCommerce.forEach(article=> verifyArticles.add(article.code_article));
        const existingArticleWooCommerce = await apiWooCommerce.get(`products?sku=${Array.from(verifyArticles).join(",")}`)
        updateWooCommerce.forEach(async article=> {

            if (existingArticleWooCommerce.data.some(art => art.id===article.id_article_woocommerce)) {
                await apiWooCommerce.put(`products/${article.id_article_woocommerce}/variations/${article.id_taille_woocommerce}`,{
                    //Instock et outofStock sont inversés parce que updateWooCommerce a l'ancienne valeur de dispo
                    //Plutôt que de me casser la tête à faire une logique plus complexe pour obtenir la nouvelle valeur de dispo
                    //J'ai juste inversé vu que je sais que si un article arrive ici ça veut dire que la valeur de dispo a changée.
                    "stock_status": article.disponible ? "outofstock" : "instock"
                })
            }
        })
    }
}, (error) =>{
    console.log(`La mise à jour automatique du stock n'a pas eu lieu à cause de cette erreur : 
    ${error}`);
})

export const findArticles = async function(articles) {
    const sql = `
    SELECT article.code_article, code_barre,dimension, stock_dimension,disponible, id_article_WooCommerce, id_taille_WooCommerce
    FROM article         
    INNER JOIN article_taille ON article.code_article=article_taille.code_article
    WHERE article.code_article IN ( '${articles.join("','")}' )
    `
    const response = await db.query(sql)

    return response.rows;

}



const articleAyantChange= async () => {
    const code_articles = await axios.get(`${process.env.API_CEGID}/articles/update/${process.env.UPDATE_STOCK_EVERY_MINUTE}`);
    // const code_articles = await axios.get(`${process.env.API_CEGID}/articles/update/500000`);

    return code_articles.data.body.articles
}

const findStockArticle = async (articles) => {
    const code_articles = articles.map( article => article.code_article);
    const tailles = await axios.post(`${process.env.API_CEGID}/articles/taille`, {articles : code_articles} )
    return tailles.data.body.articles
}