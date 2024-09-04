//Roteador:
import { Router } from "express"

// Métodos auxiliares (middleware)
import checkNewPost from "../middleware/checkNewPost.js"
import checkPostUpdate from "../middleware/checkNewPost.js"
//Métodos dos controllers:
import { CreateNewPost, GetPostByPage, getTasksByID, updatePost } from "../Controllers/BlogController.js";

// Declarand o Router:
const router = Router()

//Endpoints:
router.post("/", CreateNewPost, checkNewPost)
router.get("/", GetPostByPage)
router.get("/:id", getTasksByID)
router.put("/:id", checkPostUpdate, updatePost)
export default router;