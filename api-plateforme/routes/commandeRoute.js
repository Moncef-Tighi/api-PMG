import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController';

const router = express.Router();


router.use(protect);
    router.get('/', controllers.listeCommandes);
    router.post('/create', controllers.createCommande);
    router.p0ut('/update', controllers.updateCommande);
    router.patch('/status', controllers.updateCommandeStatus);
    router.patch('/disable', controllers.disableCommande);
    router.get('/:id', controllers.oneCommande);
    
export default router;