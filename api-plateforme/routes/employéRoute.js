import express from "express";
import * as controllers from '../controllers/employeController.js';
import { protect, restrict } from "../controllers/authenticationController.js";

const router = express.Router();

router.get("/", controllers.listEmployes);

router.use(protect)
//Ces Routes permettent à un utilisateur de changer ses propres informations.
    router.get("/profile", controllers.profile);
    router.patch("/my_password", controllers.changeMyPassword);
    router.put("/editProfile", controllers.modifySelf);
    router.use(restrict('admin'))
        router.post("/creation", controllers.createEmploye);
        router.put("/modifier", controllers.modifyAnyEmploye);
        //Route qui permet à un admin de changer n'importe quel mot de passe.
        router.patch('/password', controllers.changeAnyPassword);
        router.patch("/activer", controllers.enableEmploye);
        router.delete("/supprimer", controllers.disableEmploye);
        router.get("/:id", controllers.findEmploye);
        //router.get("/", controllers.listEmployes);

export default router;