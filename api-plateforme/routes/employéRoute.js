import express from "express";
import * as controllers from '../controllers/employeController.js';

const router = express.Router();

router.post("/creation", controllers.createEmploye);
router.delete("/delete", controllers.disableEmploye);
router.patch("/modifier", controllers.modifyEmploye);
router.get("/:id", controllers.findEmploye);
router.get("/", controllers.listEmployes);

export default router;