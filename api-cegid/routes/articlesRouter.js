import express from "express";
import * as controllers from '../controllers/articlesController.js';

const router = express.Router()

router.get("/", controllers.listArticles);
router.get("/:article", controllers.unArticle);
router.post("/disponible", controllers.ArticlesDisponible);
router.post("/detail", controllers.detailArticle);

export default router