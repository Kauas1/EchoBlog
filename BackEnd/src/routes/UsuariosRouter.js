import { Router } from "express";

//Importando os Controllers:
import { createUser, loginUser, updateUser } from "../Controllers/UsuariosController.js";

// // Declarand o Router:
const router = Router();

// //Endpoints:

router.post("/registro", createUser)
router.post("/login", loginUser)
router.put("/:id", updateUser)

// Exportando Rota: 

export default router;