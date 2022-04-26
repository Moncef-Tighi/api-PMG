import express from "express";
import * as controllers from '../controllers/employeController.js';
import { protect } from "../controllers/authenticationController.js";
import passport from "passport";
const router = express.Router();

router.post("/creation", controllers.createEmploye);
router.delete("/delete", controllers.disableEmploye);
router.patch("/modifier", controllers.modifyEmploye);
router.get("/:id", controllers.findEmploye);
router.get("/", passport.authenticate('jwt', {session: false}), controllers.listEmployes);

export default router;