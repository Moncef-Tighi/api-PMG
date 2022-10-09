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
export const marques_id = await apiWooCommerce.get("products/brands");
// marques_id= [{id : 48, slug : "geox"},]
export default apiWooCommerce
