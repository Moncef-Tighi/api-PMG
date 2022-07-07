import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';
import * as contenu from '../controllers/commandeContenuController.js';

const router = express.Router();


router.post('/create', controllers.createCommande);
// router.use(protect);
router.get('/', controllers.listeCommandes);
router.post('/contenu/add/:id', protect, controllers.checkAttribution, contenu.addToCommandeContenu);
router.patch('/contenu/quantite/:id', protect,controllers.checkAttribution, contenu.changeQuantity);
router.delete('/contenu/remove/:id', protect, controllers.checkAttribution, contenu.removeFromCommandeContenu);
router.put('/update/:id', protect, controllers.checkAttribution ,controllers.updateCommande);
router.patch('/status', controllers.updateCommandeStatus);
router.patch('/disable', controllers.disableCommande);
router.post('/attribution/:id', protect, controllers.changeCommandeAttribution);
router.get('/:id', controllers.oneCommande);
    
export default router;