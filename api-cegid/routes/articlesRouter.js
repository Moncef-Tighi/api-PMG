import express from "express";
import * as controllers from '../controllers/articlesController.js';

const router = express.Router()

router.get("/disponible", controllers.produitsDisponible);
router.get("/:nom_produit", controllers.detailProduit)
router.get("/", controllers.listProduits)

export default router