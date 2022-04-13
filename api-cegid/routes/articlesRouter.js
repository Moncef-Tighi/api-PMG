import express from "express";
import * as controllers from '../controllers/articlesController.js';

const router = express.Router()

router.get("/", controllers.listArticles);
router.get("/:article", controllers.unArticle);
router.get("/detail_stock/:article", controllers.ArticleDepot);
router.get("/tarifs/:article", controllers.historiqueTarif);
router.post("/disponible", controllers.ArticlesDisponible);

export default router