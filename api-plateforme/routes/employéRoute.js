import express from "express";
import * as controllers from '../controllers/employeController.js';
import { protect, restrict } from "../controllers/authenticationController.js";

const router = express.Router();

router.use(protect)
    //Route qui permet à un employé de changer son propre mot de passe.
    router.get("/profile", controllers.profile);
    router.patch("/my_password", controllers.changeMyPassword);

    router.use(restrict('admin'))
        router.post("/creation", controllers.createEmploye);
        router.put("/modifier", controllers.modifyEmploye);
        //Route qui permet à un admin de changer n'importe quel mot de passe.
        router.patch('/password', controllers.changeAnyPassword);
        router.patch("/activer", controllers.enableEmploye);
        router.delete("/supprimer", controllers.disableEmploye);
        router.get("/:id", controllers.findEmploye);
        router.get("/", controllers.listEmployes);

export default router;