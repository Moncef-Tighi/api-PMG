import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/articleController.js';

const router = express.Router();

router.get('/liste', controllers.listeArticle);
router.get('/:id', controllers.unArticle);
router.post('/status', controllers.articleEtat);
router.post('/insertion', controllers.ajoutArticle);
router.patch('/activer/:id', controllers.enableArticle);
router.patch('/desactiver/:id', controllers.disableArticle);
router.use(protect);

export default router;