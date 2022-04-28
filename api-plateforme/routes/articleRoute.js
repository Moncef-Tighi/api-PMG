import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';
import * as controllers from '../controllers/articleController.js';

const router = express.Router();

router.get('/liste', controllers.listeArticle);
router.post('/insertion', controllers.ajoutArticle );
router.use(protect);

export default router;