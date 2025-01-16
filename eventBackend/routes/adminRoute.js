import express from "express";
import { addNewTagToAdmin, adminInfoById, adminLogin, adminLogout, allAdmin, deleteAdmin, registerAdmin, removeTagFromAdmin, updateInfoById } from "../controllers/adminController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.route('/register').post(registerAdmin);
router.route("/login").post(adminLogin);
router.route("/all").get(allAdmin);
router.route("/logout").get(adminLogout);
router.route("/:id").get(adminInfoById);
router.route("/:id/edit").put(updateInfoById);
router.route("/:id/newtag").post(addNewTagToAdmin);
router.route("/:id/removetag").post(removeTagFromAdmin);
router.route("/:id").delete(deleteAdmin);






export default router;