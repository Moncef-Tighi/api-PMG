import express from "express";
import * as controllers from '../controllers/roleController.js';

const router = express.Router();

router.get("/", controllers.listeRole);
router.post("/creation", controllers.createRole);
router.put("/modifier", controllers.modifyRole);
//La suppression est très dangereuse à cause des foreign key
//Par défaut la route ne fonctionne pas, sauf si l'option CASCADE est ajouté à la table roles, chose qui ne doit JAMAIS être fait.
// router.delete("/supprimer", controllers.deleteRole);

export default router;
