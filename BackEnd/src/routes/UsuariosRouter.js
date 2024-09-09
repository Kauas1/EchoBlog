import { Router } from "express";

//Importando os Controllers:
import { createUser, loginUser } from "../Controllers/UsuariosController.js";

// // Declarand o Router:
const router = Router();

// //Endpoints:

router.post("/registro", createUser)
router.post("/login", loginUser)

// Exportando Rota: 

export default router;