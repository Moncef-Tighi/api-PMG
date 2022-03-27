import express from "express";
import * as controllers from '../controllers/produitsController.js';

const router = express.Router()

router.get("/disponible", controllers.produitsDisponible);
router.get("/:nom_produit", controllers.detailProduit)
router.get("/", controllers.listProduits)

export default router