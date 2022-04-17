import express from "express";
import * as controllers from '../controllers/tarifsController.js';

const router = express.Router()

router.get("/:article", controllers.historiqueTarif);
router.post("/", controllers.derniersTarifs);

export default router