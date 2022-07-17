import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';
import contenuRouter from "./commandeContenuRoute.js";

const router = express.Router();


router.post('/create', controllers.createCommande);
router.use('/contenu', contenuRouter)
// router.use(protect);
router.get('/', controllers.listeCommandes);
router.put('/update/:id', protect, controllers.checkAttribution ,controllers.updateCommande);
router.patch('/appel/:id', protect, controllers.checkAttribution ,controllers.appelClient);
router.patch('/status', controllers.updateCommandeStatus);
router.patch('/disable', controllers.disableCommande);
router.post('/attribution/:id', protect, controllers.changeCommandeAttribution);
router.get('/:id', controllers.oneCommande);
    
export default router;