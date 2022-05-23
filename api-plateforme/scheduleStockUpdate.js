import  {AsyncTask} from 'toad-scheduler';

export const autoUpdateStock = new AsyncTask('simple task', async ()=> {
    //TOUTE LES X MINUTES CETTE FONCTION EST EXECUTEE POUR METTRE A JOUR LE STOCK COTE PLATEFORME 
    //Le but est de garder le stock à jour sur la plateforme pour qu'elle puisse servir de source de vérité
    //Aux autres applications qui ont besoin du stock.

    //WooCommerce ne gère pas le stock, on lui envoie juste instock ou outofstock au besoin.
    //Pour pouvoir envoyer ça il faut un algorithme qui va chercher si il y a eu un changement dans le status de l'article
    //Et envoyer une requête si c'est le cas

    console.log("a");
    
}, (error) =>{
    console.log(`La mise à jour automatique du stock n'a pas eu lieu à cause de cette erreur : 
    ${error}`);
})

