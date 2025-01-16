import express from "express";
import { clientEventInfo } from "../controllers/clientController.js";


const router = express.Router();
router.route('/information').post(clientEventInfo);

export default router;
