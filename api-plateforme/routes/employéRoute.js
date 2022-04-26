import express from "express";
import * as controllers from '../controllers/employeController.js';
import { protect, restrict } from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/creation", controllers.createEmploye);
router.delete("/delete", controllers.disableEmploye);
router.patch("/modifier", controllers.modifyEmploye);
router.use(protect, restrict('admin'))
router.get("/:id", controllers.findEmploye);
router.get("/", controllers.listEmployes);

export default router;