import express from "express";
import * as controllers from '../controllers/tarifsController';

const router = express.Router()

router.get("/tarifs/:article", controllers.historiqueTarif);

export default router