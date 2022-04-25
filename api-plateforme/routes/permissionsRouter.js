import express from "express";
import * as controllers from '../controllers/permissionsController.js';

const router = express.Router();

router.post("/ajouter", controllers.addPermission);

// router.post("/", controllers.listEmployes);
// router.post("/creation", controllers.createEmploye);
// router.post("/delete", controllers.disableEmploye);
// router.post("/modifier", controllers.modifyEmploye);

export default router;