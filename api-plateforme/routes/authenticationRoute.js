import express from "express";
import * as controllers from '../controllers/authenticationController.js';

const router = express.Router();

router.post("/connexion", controllers.connexion);
router.use(controllers.protect);
export default router;