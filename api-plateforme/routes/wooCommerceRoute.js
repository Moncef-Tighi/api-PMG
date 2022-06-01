import express from "express";
import * as controllers from '../controllers/wooCommerceController.js';
import * as controllerArticle from '../controllers/articleController.js';
const router = express.Router();


router.get("/categorie", controllers.getCategorie);
router.post("/ajout/taille", controllerArticle.insertTailleWooCommerce);
router.post("/ajout", controllerArticle.insertArticlesWooCommerce);

// router.patch("/prix", controllers.updatePrixArticle);
// router.patch("/stock", controllers.updateStock);
// router.post("/creation", controllers.createRole);
// router.put("/modifier", controllers.modifyRole);

export default router;
