import { Router } from "express";

//Importando os Controllers:
import { createUser } from "../Controllers/UsuariosController.js";

// // Declarand o Router:
const router = Router();

// //Endpoints:

router.post("/registro", createUser)


// Exportando Rota: 

export default router;