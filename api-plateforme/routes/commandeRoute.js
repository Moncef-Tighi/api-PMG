import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController.js';
import * as historique from '../controllers/commadeHistoriqueController.js';
import contenuRouter from "./commandeContenuRoute.js";

const router = express.Router();


router.post('/create', controllers.createCommande);
router.use('/contenu', contenuRouter)
// router.use(protect);
router.get('/', controllers.listeCommandes);
router.get('/historique/:id', historique.historiqueOneCommande);
router.put('/update/:id', protect, controllers.checkAttribution ,controllers.updateCommande);
router.post('/attribution/:id', protect, controllers.changeCommandeAttribution);
router.patch('/appel/:id', protect, controllers.checkAttribution ,controllers.appelClient);
router.patch('/status', controllers.updateCommandeStatus);
router.patch('/disable', controllers.disableCommande);
router.get('/:id', controllers.oneCommande);
    
export default router;