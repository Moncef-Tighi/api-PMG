import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';
import * as contenu from '../controllers/commandeContenuController.js';

const router = express.Router();


// router.use(protect);
    router.get('/', controllers.listeCommandes);
    router.post('/create', controllers.createCommande);
    router.post('/add/contenu/:id', protect, controllers.checkAttribution, contenu.addToCommandeContenu);
    router.put('/update/:id', protect, controllers.checkAttribution ,controllers.updateCommande);
    router.patch('/status', controllers.updateCommandeStatus);
    router.patch('/disable', controllers.disableCommande);
    router.post('/attribution/:id', protect, controllers.changeCommandeAttribution);
    router.get('/:id', controllers.oneCommande);
    
export default router;