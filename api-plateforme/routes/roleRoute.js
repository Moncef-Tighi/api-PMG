import express from "express";
import * as controllers from '../controllers/roleController.js';

const router = express.Router();

router.get("/", controllers.listeRole);
router.post("/creation", controllers.createRole);
router.put("/modifier", controllers.modifyRole);
router.delete("/delete", controllers.deleteRole);

export default router;
