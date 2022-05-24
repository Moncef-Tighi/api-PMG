import  {AsyncTask} from 'toad-scheduler';
import axios from 'axios';
import db from './models/postGreSql.js';
import { updateStockTaille } from './models/article.js';

export const autoUpdateStock = new AsyncTask('simple task', async ()=> {
    //TOUTE LES X MINUTES CETTE FONCTION EST EXECUTEE POUR METTRE A JOUR LE STOCK COTE PLATEFORME 
    //Le but est de garder le stock à jour sur la plateforme pour qu'elle puisse servir de source de vérité
    //Aux autres applications qui ont besoin du stock.

    //WooCommerce ne gère pas le stock, on lui envoie juste instock ou outofstock au besoin.
    //Pour pouvoir envoyer ça il faut un algorithme qui va chercher si il y a eu un changement dans le status de l'article
    //Et envoyer une requête si c'est le cas
    const code_article = await articleAyantChange();
    const articlesInPlateforme= await findArticles(code_article)
    const stockArticles = await findStockArticle(articlesInPlateforme);
    const update = await updateStockTaille(stockArticles);

    const updateWooCommerce = articlesInPlateforme.filter(article => {
        return update.find(articleUpdate => article.code_article===articleUpdate.code_article 
            && article.disponible!=articleUpdate.disponible);
    })
    console.log(updateWooCommerce);
}, (error) =>{
    console.log(`La mise à jour automatique du stock n'a pas eu lieu à cause de cette erreur : 
    ${error}`);
})

export const findArticles = async function(articles) {
    const sql = `
    SELECT article.code_article, code_barre,dimension, stock_dimension,disponible
    FROM article         
    INNER JOIN article_taille ON article.code_article=article_taille.code_article
    WHERE article.code_article IN ( '${articles.join("','")}' )
    `
    const response = await db.query(sql)

    return response.rows;

}



const articleAyantChange= async () => {
    // const code_articles = await axios.get(`${process.env.API_CEGID}/articles/update/${process.env.UPDATE_STOCK_EVERY_MINUTE}`);
    const code_articles = await axios.get(`${process.env.API_CEGID}/articles/update/500000`);

    return code_articles.data.body.articles
}

const findStockArticle = async (articles) => {
    const code_articles = articles.map( article => article.code_article);
    const tailles = await axios.post(`${process.env.API_CEGID}/articles/taille`, {articles : code_articles} )
    return tailles.data.body.articles
}