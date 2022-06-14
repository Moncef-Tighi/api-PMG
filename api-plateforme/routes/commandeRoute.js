import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/commandeController';

const router = express.Router();


router.use(protect);
    router.get('/', controllers.listeArticle);
    router.post('/create', controllers.ventesArticle);
    router.put('/update', controllers.articleEtat);
    router.patch('/disable', controllers.ventesArticle);
    router.patch('/status', controllers.ventesArticle);
    router.get('/:id', controllers.unArticle);
    
export default router;