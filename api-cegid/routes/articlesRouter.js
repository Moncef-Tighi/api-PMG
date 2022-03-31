import express from "express";
import * as controllers from '../controllers/articlesController.js';

const router = express.Router()

router.get("/disponible", controllers.ArticlesDisponible);
router.get("/:nom_produit", controllers.detailArticle);
router.get("/", controllers.listArticles);

export default router