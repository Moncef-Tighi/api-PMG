import express from "express";
import * as controllers from '../controllers/employeController.js';
import { protect, restrict } from "../controllers/authenticationController.js";

const router = express.Router();

router.post("/creation", controllers.createEmploye);
router.delete("/delete", controllers.disableEmploye);
router.patch("/modifier", controllers.modifyEmploye);
router.use(protect)
    //Route qui permet à un employé de changer son propre mot de passe.
    router.patch("/my_password", controllers.changeMyPassword);
    router.use(restrict('admin'))
        //Route qui permet à un admin de changer n'importe quel mot de passe.
        router.patch('/password', controllers.changeAnyPassword);
        router.get("/:id", controllers.findEmploye);
        router.get("/", controllers.listEmployes);

export default router;