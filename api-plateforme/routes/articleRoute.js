import express from "express";
import {protect, restrict} from '../controllers/authenticationController.js';

const router = express.Router();

router.use(protect);

export default router;