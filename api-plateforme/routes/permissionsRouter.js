import express from "express";
import * as controllers from '../controllers/permissionsController.js';

const router = express.Router();

router.post("/ajouter", controllers.idFromEmailAndRole , controllers.addPermission);
router.delete("/supprimer", controllers.idFromEmailAndRole , controllers.removePermission);

export default router;
