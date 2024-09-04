//Roteador:
import { Router } from "express"

// Métodos auxiliares (middleware)
import checkNewPost from "../middleware/checkNewPost.js"

//Métodos dos controllers:
import { CreateNewPost, GetPostByPage, getTasksByID } from "../Controllers/BlogController.js";

// Declarand o Router:
const router = Router()

//Endpoints:
router.post("/", CreateNewPost, checkNewPost)
router.get("/", GetPostByPage)
router.get("/:id", getTasksByID)
export default router;