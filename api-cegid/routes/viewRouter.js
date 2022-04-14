import express from "express";
import * as controllers from '../controllers/viewsController.js';

const router = express.Router()

router.get("/recherche", controllers.recherche);
router.get("/recherche/:article", controllers.unArticle);

export default router