import { Router } from "express";
import bodyParser from "body-parser"

// //Métodos dos controllers:
import { create, deletePostagem, getAll, getTasksByID, updatePost, uploadImagePostagem } from "../controllers/BlogController.js";


import imageUpload from "../helpers/image-upload.js";

// Declarand o Router:
const router = Router();

// //Endpoints:
router.post("/", imageUpload.single("imagem"), create);
router.get("/", getAll);
router.get("/:id", getTasksByID);
router.put("/:id", updatePost);
router.delete("/:id", deletePostagem);
router.post("/:id/imagem", bodyParser.raw({type: ["image/jpeg", "image/png", "image/jpg"], limit: "5mb"}), uploadImagePostagem)

export default router;