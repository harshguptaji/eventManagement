import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
import { allUser, deleteUser, registerUser, updateUserInfoById, userInfoById } from "../controllers/userController.js";



const router = express.Router();

router.route('/register').post(registerUser);
router.route('/all').get(allUser);
router.route('/:id').get(userInfoById);
router.route('/:id/edit').put(updateUserInfoById);
router.route('/:id/delete').delete(deleteUser);


export default router;
