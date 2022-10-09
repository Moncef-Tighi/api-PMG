import pkg from "@woocommerce/woocommerce-rest-api";
const WooCommerceRestApi = pkg.default;

try {
    var apiWooCommerce = new WooCommerceRestApi({
      url: process.env.WOOCOMMERCE_URL,
      consumerKey: process.env.KEY_WOOCOMMERCE,
      consumerSecret: process.env.SECRET_WOOCOMMERCE,
      queryStringAuth: true,
      axiosConfig: {
        headers: {'Content-Type': 'application/json'},
    }
    });
    const result = await apiWooCommerce.get("products/categories");
    if (result) console.log(`Connexion à l'API de WooCommerce réussie`);

} catch(error) {
    console.log(`Impossible de se connecter à l'API wooCommerce.
    Erreur : ${error}`);
}

//On récupère l'id des marques parce qu'on en a besoin pour ajouter une brand à un article
if (process.env.NODE_ENV==="production") {
    var value = await apiWooCommerce.get("products/brands?per_page=100");
} else {
    //J'ai besoin de faire ça parce que le module brand est payant, donc je ne l'ai pas en dev
    var value = null
}
export const marques_id= value
// marques_id= [{id : 48, slug : "geox"},]
export default apiWooCommerce
