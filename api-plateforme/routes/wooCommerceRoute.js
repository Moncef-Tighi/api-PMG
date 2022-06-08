import express from "express";
import * as controllers from '../controllers/wooCommerceController.js';
const router = express.Router();


router.get("/categorie", controllers.getCategorie);
router.post("/categorie/articles", controllers.getCategorieForArticle);
router.get("/commandes", controllers.getCommandes);
router.post("/ajout/taille", controllers.insertTailleWooCommerce);
router.post("/ajout", controllers.insertArticlesWooCommerce);
router.patch("/update", controllers.updateArticleWooCommerce);

export default router;
