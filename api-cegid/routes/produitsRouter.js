import express from "express";
import * as controllers from '../controllers/produitsController.js';

const router = express.Router()

router.get("/", controllers.listProduits)
router.get("/:nom_produit", controllers.detailProduit)
router.get("/disponible", controllers.produitsDisponible);
router.post("/commande/:nom_produit", controllers.commande);


export default router