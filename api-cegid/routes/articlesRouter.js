import express from "express";
import * as controllers from '../controllers/articlesController.js';

const router = express.Router()

router.get("/", controllers.listArticles);
router.post("/disponible", controllers.ArticlesDisponible);
router.get("/update/:minutes", controllers.updateStock);
router.get("/detail_stock/:article", controllers.ArticleDepot);
router.get("/:article", controllers.unArticle);

export default router