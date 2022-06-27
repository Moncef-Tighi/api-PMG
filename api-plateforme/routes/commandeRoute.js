import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';

const router = express.Router();


// router.use(protect);
    router.get('/', controllers.listeCommandes);
    router.post('/create', controllers.createCommande);
    router.patch('/update/contenu', protect, controllers.checkAttribution ,controllers.updateCommande);
    router.put('/update', protect, controllers.checkAttribution ,controllers.updateCommande);
    router.patch('/status', controllers.updateCommandeStatus);
    router.patch('/disable', controllers.disableCommande);
    router.post('/attribution/:id', protect, controllers.changeCommandeAttribution);
    router.get('/:id', controllers.oneCommande);
    
export default router;