import express from "express";
import * as controllers from '../controllers/authenticationController.js';

const router = express.Router();

router.post("/", controllers.listEmployes);
router.post("/creation", controllers.createEmploye);
router.post("/delete", controllers.disableEmploye);
router.post("/modifier", controllers.modifyEmploye);

export default router;