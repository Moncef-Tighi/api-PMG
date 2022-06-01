import express from "express";
import * as controllers from '../controllers/wooCommerceController.js';
const router = express.Router();


router.get("/categorie", controllers.getCategorie);
router.post("/ajout/taille", controllers.insertTailleWooCommerce);
router.post("/ajout", controllers.insertArticlesWooCommerce);

// router.patch("/prix", controllers.updatePrixArticle);
// router.patch("/stock", controllers.updateStock);
// router.post("/creation", controllers.createRole);
// router.put("/modifier", controllers.modifyRole);

export default router;
