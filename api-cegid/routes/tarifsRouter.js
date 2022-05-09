import express from "express";
import * as controllers from '../controllers/tarifsController.js';

const router = express.Router()

router.get("/:article", controllers.historiqueTarif);
router.get("/", controllers.derniersTarifs);

export default router