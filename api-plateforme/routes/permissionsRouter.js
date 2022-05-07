import express from "express";
import * as controllers from '../controllers/permissionsController.js';
import { protect, restrict } from "../controllers/authenticationController.js";
const router = express.Router();

router.use(protect)
router.use(restrict("admin"))
router.post("/ajouter", controllers.emailAndRoleAndId , controllers.newPermission);
router.delete("/supprimer", controllers.emailAndRoleAndId , controllers.removePermission);

export default router;
