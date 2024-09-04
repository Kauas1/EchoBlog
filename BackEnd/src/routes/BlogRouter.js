//Roteador:
import { Router } from "express"

// Métodos auxiliares (middleware)
import checkNewPost from "../middleware/checkNewPost.js"

//Métodos dos controllers:
import { CreateNewPost, GetPostByPage } from "../Controllers/BlogController.js";

// Declarand o Router:
const router = Router()

//Endpoints:
router.post("/", CreateNewPost, checkNewPost)
router.get("/", GetPostByPage)

export default router;