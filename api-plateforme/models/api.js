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
    const liste_taille_woocommerce = await apiWooCommerce.get(`products/attributes/3/terms?per_page=100`)
    if (liste_taille_woocommerce.headers["x-wp-totalpages"]>1) {
        const page2 = await apiWooCommerce.get(`products/attributes/3/terms?per_page=100&page=2`)
        liste_taille_woocommerce.data.push(...page2.data);
    }
    if (liste_taille_woocommerce.headers["x-wp-totalpages"]>2) {
        const page3 = await apiWooCommerce.get(`products/attributes/3/terms?per_page=100&page=3`)
        liste_taille_woocommerce.data.push(...page3.data);
    }
} catch(error) {
    console.log(`Impossible de se connecter à l'API wooCommerce.
    Erreur : ${error}`);
}


export default apiWooCommerce
