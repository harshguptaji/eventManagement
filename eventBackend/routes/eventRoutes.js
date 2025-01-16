import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
import { addNewEvent, addUserInEvent, allEvents, deleteEvent, eventInfoById, removeUserFromEvent, searchingNumberInAllEvents, updateEventInfoById } from "../controllers/eventController.js";


const router = express.Router();
router.route('/register').post(addNewEvent);
router.route('/all').get(allEvents);
router.route('/:id').get(eventInfoById);
router.route('/:id/edit').put(updateEventInfoById);
router.route('/:id/addnewuser').post(addUserInEvent);
router.route('/:id/removeuser').post(removeUserFromEvent);
router.route('/searching').post(searchingNumberInAllEvents);
router.route('/:id/delete').delete(deleteEvent);



export default router;
