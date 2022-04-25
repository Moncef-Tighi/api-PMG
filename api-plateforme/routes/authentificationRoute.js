import express from "express";
import * as controllers from '../controllers/authenticationController.js';

const router = express.Router()

router.get("/add", controllers.add);

export default router