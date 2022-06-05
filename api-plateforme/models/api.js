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


// apiWooCommerce.get('products').then(res => console.log(res));

export default apiWooCommerce
