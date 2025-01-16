import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addEventFlow, addStepFlow, allEventFlow, deleteEventFlow, eventFlowInfoById, removeStepFlow, searchingEventFlow, updateEventFlowNumber, updateInfoStepFlow, updateOrderStepFlow, updateStatusStepFlow } from "../controllers/eventFlowController.js";



const router = express.Router();
router.route('/register').post(addEventFlow);
router.route('/all').get(allEventFlow);
router.route('/:id').get(eventFlowInfoById);
router.route('/:id/edit').put(authMiddleware(), updateEventFlowNumber);
router.route('/:id/addstepflow').post(addStepFlow);
router.route('/:id/deletestepflow').post(removeStepFlow);
router.route('/:id/editstepflow').put(authMiddleware(), updateInfoStepFlow);
router.route('/:id/updatestepflowstatus').put(updateStatusStepFlow);
router.route('/:id/updatestepfloworder').put(updateOrderStepFlow);
router.route('/:id/delete').delete(deleteEventFlow);
router.route('/searching').post(authMiddleware(), searchingEventFlow);


export default router;