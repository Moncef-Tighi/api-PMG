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
} catch(error) {
    console.log(`Impossible de se connecter à l'API wooCommerce.
    Erreur : ${error}`);
}

export default apiWooCommerce
