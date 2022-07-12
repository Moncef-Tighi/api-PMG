import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';
import * as contenu from '../controllers/commandeContenuController.js';

const router = express.Router();


router.post('/add/:id', protect, controllers.checkAttribution, contenu.addToCommandeContenu);
router.patch('/quantite/:id', protect,controllers.checkAttribution, contenu.changeQuantity);
router.delete('/remove/:id', protect, controllers.checkAttribution, contenu.removeFromCommandeContenu);
router.get("/:id", contenu.contenuCommande);
    
export default router;