import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/articleController.js';

const router = express.Router();


router.use(protect);
    router.get('/liste', controllers.listeArticle);
    router.get('/vente', controllers.ventesArticle);
    router.get('/status', controllers.articleEtat);
    router.post('/insertion', restrict("admin", "modification"), controllers.ajoutArticle);
    router.post('/batch/insert', restrict("admin", "modification"), controllers.insertArticles);
    router.patch('/prix', restrict("admin", "modification"), controllers.updatePrixArticle);
    router.patch('/activer/:id', restrict("admin", "modification"), controllers.enableArticle);
    router.patch('/desactiver/:id', restrict("admin", "modification"), controllers.disableArticle);
    router.get('/:id', controllers.unArticle);

export default router;