import express from "express";
import * as controllers from '../controllers/permissionsController.js';
import { protect, restrict } from "../controllers/authenticationController.js";
const router = express.Router();

router.use(protect)
    router.post("/ajouter", restrict('admin'), controllers.emailAndRoleAndId , controllers.newPermission);
    router.delete("/supprimer", restrict('admin') ,controllers.emailAndRoleAndId , controllers.removePermission);

export default router;
