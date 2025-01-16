import express from "express"
// import authMiddleware from "../middleware/authMiddleware.js";
import { addNewTag, allTags, deleteTagById } from "../controllers/tagController.js";

const router = express.Router();


router.route("/register").post(addNewTag);
router.route("/all").get(allTags);
router.route("/delete/:id").delete(deleteTagById);

export default router;

